import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { pdfToText } from "@/utils/pdfToText";

export default function IngestKnowledge() {
  const [tenantId, setTenantId] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleChooseFile(f: File | null) {
    setFile(f);
    setPreview("");
    if (!f) return;

    // Show a short preview of extracted text (helps verify before ingest)
    try {
      setStatus("Extraction du texte du PDF…");
      const text = await extractTextFromPDF(f);
      setPreview(text.slice(0, 2000));
      setStatus(null);
    } catch (e: any) {
      setStatus(`❌ Impossible de lire ce PDF: ${e.message || e}`);
    }
  }

  async function handleIngest() {
    setLoading(true);
    setStatus("Préparation de l’ingestion…");

    try {
      if (!tenantId) throw new Error("Renseigne un tenant_id (UUID).");

      // Build request body for the Edge Function
      const body: any = {
        tenant_id: tenantId,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        lang: "fr",
      };

      if (url.trim()) {
        body.url = url.trim();
        body.source_type = "web";
        setStatus("📡 Récupération et traitement de la page web…");
      } else if (file) {
        setStatus("📄 Envoi du contenu PDF…");
        const text = preview || (await extractTextFromPDF(file));
        if (!text || text.length < 30) {
          throw new Error("Le PDF ne contient pas assez de texte exploitable.");
        }
        body.content = text;
        body.title = file.name;
        body.source_type = "pdf";
      } else {
        throw new Error("Fournis soit une URL, soit un fichier PDF.");
      }

      // ✅ Call Edge Function safely through Supabase client
      const { data, error } = await supabase.functions.invoke("ingest-kb", {
        body,
      });

      if (error) throw error;
      if (!data) throw new Error("Réponse vide de la fonction.");

      setStatus(
        `✅ Ingestion réussie : ${data.inserted || 0}/${data.attempted || 0} chunks ajoutés.`
      );
    } catch (e: any) {
      setStatus(`❌ ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F7F6] p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-6 border border-[#A4D4AE]/30">
        <h1 className="text-2xl font-semibold text-[#005B5F] mb-4">
          Ingestion de connaissances — Zéna
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Colle une <b>URL</b> (ANACT, OMS, interne) ou ajoute un <b>PDF</b>. Le contenu sera
          découpé et stocké dans <code>kb_chunks</code>.
        </p>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Tenant ID (UUID)</span>
          <input
            type="text"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            placeholder="00000000-0000-0000-0000-000000000000"
            className="mt-1 w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#A4D4AE]"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">URL (facultatif)</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.anact.fr/prevenir-le-stress-au-travail"
            className="mt-1 w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#A4D4AE]"
          />
        </label>

        <div className="my-3 text-center text-gray-500">— ou —</div>

        <label className="block mb-2">
          <span className="text-sm font-medium text-gray-700">Fichier PDF (facultatif)</span>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleChooseFile(e.target.files?.[0] || null)}
            className="mt-1 w-full border rounded-lg p-2 bg-[#F2F7F6] cursor-pointer"
          />
        </label>

        {preview && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Aperçu (2000 premiers caractères)</div>
            <textarea
              value={preview}
              readOnly
              rows={6}
              className="w-full border rounded-lg p-2 text-sm bg-gray-50"
            />
          </div>
        )}

        <label className="block mb-5">
          <span className="text-sm font-medium text-gray-700">
            Tags (séparés par des virgules)
          </span>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ANACT, QVT, prévention, stress"
            className="mt-1 w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#A4D4AE]"
          />
        </label>

        <button
          onClick={handleIngest}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-[#005B5F] hover:bg-[#004347]"
          }`}
        >
          {loading ? "Traitement en cours…" : "Lancer l’ingestion"}
        </button>

        {status && (
          <div
            className={`mt-4 text-sm rounded-lg p-3 ${
              status.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
