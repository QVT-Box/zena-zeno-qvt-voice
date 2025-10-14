import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const EMB_MODEL = "text-embedding-3-small";

type Body = {
  tenant_id: string;
  objects: { path: string; name?: string; mime?: string }[];
  lang?: "fr" | "en";
  tags?: string[];
  bucket?: string;
};

async function sha256(s: string) {
  const data = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function chunkText(txt: string, size = 1200, overlap = 150) {
  const chunks: string[] = [];
  let i = 0;
  while (i < txt.length) {
    const end = Math.min(i + size, txt.length);
    chunks.push(txt.slice(i, end));
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks.filter(c => c.trim().length > 0);
}

async function signedFetch(bucket: string, path: string): Promise<Uint8Array> {
  const { data, error } = await supa.storage
    .from(bucket)
    .createSignedUrl(path, 180);
  if (error) throw error;
  const res = await fetch(data.signedUrl);
  if (!res.ok) throw new Error("fetch storage " + res.status);
  return new Uint8Array(await res.arrayBuffer());
}

async function extractText(
  bucket: string,
  obj: { path: string; name?: string; mime?: string }
): Promise<string> {
  const mime = (obj.mime || "").toLowerCase();
  const name = (obj.name || "").toLowerCase();

  // Pour TXT et MD uniquement
  if (
    mime.includes("text/plain") ||
    name.endsWith(".txt") ||
    name.endsWith(".md")
  ) {
    const bytes = await signedFetch(bucket, obj.path);
    return new TextDecoder().decode(bytes);
  }

  throw new Error(
    "Seuls TXT et MD sont supportés. Pour PDF/DOCX, configurez UNSTRUCTURED_URL"
  );
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMB_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error("embeddings " + res.status);
  const j = await res.json();
  return j.data.map((d: any) => d.embedding);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      tenant_id,
      objects,
      lang = "fr",
      tags = [],
      bucket = "kb",
    } = (await req.json()) as Body;

    if (!tenant_id || !objects?.length) {
      return new Response(
        JSON.stringify({ error: "missing tenant_id or objects" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { data: { user }, error: authError } = await supa.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Vérifier que l'utilisateur est membre du tenant
    const { data: allowed } = await supa.rpc("is_member_of_tenant", {
      tid: tenant_id,
    });
    if (!allowed) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    console.log(`[ingest-kb] Processing ${objects.length} files for tenant ${tenant_id}`);

    for (const obj of objects) {
      const { data: src, error: e1 } = await supa
        .from("kb_sources")
        .insert({
          tenant_id,
          object_path: obj.path,
          original_name: obj.name ?? null,
          mime_type: obj.mime ?? null,
          status: "processing",
        })
        .select()
        .single();

      if (e1) {
        console.error("[ingest-kb] Error creating source:", e1);
        throw e1;
      }

      try {
        console.log(`[ingest-kb] Extracting text from ${obj.name}`);
        const text = (await extractText(bucket, obj)).trim();
        if (!text) throw new Error("empty text");

        const chunks = chunkText(text);
        console.log(`[ingest-kb] Created ${chunks.length} chunks`);

        // Batch embeddings
        const embeddings = await embedBatch(chunks);
        console.log(`[ingest-kb] Generated ${embeddings.length} embeddings`);

        const rows = await Promise.all(
          chunks.map(async (content, i) => ({
            tenant_id,
            source_id: src.id,
            title: obj.name ?? "Document QVT",
            content,
            lang,
            tags,
            content_sha256: await sha256(content),
            embedding: JSON.stringify(embeddings[i]),
          }))
        );

        const { error: e2 } = await supa.from("kb_chunks").insert(rows);
        if (e2) {
          console.error("[ingest-kb] Error inserting chunks:", e2);
          throw e2;
        }

        await supa
          .from("kb_sources")
          .update({ status: "done", processed_at: new Date().toISOString() })
          .eq("id", src.id);

        console.log(`[ingest-kb] Successfully processed ${obj.name}`);
      } catch (err) {
        console.error(`[ingest-kb] Error processing ${obj.name}:`, err);
        await supa
          .from("kb_sources")
          .update({ status: "error", error: String(err) })
          .eq("id", src.id);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[ingest-kb] Fatal error:", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
