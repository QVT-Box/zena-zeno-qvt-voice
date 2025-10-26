import { useState } from "react";
import { pdfToText } from "@/utils/pdfToText"; // 🔸 (crée ce helper juste après)
import { supabase } from "@/integrations/supabase/client";

export default function IngestKnowledge() {
  const [tenantId, setTenantId] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleIngest() {
    setLoading(true);
    setStatus("Préparation de l’ingestion...");

    try {
      if (!tenantId) throw new Error("Veuillez renseigner un tenant_id (uuid).");

      let body: any = {
        tenant_id: tenantId,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        lang: "fr",
      };

      if (url) {
        body.url = url;
        body.source_type = "web";
        setStatus("📡 Téléchargement et traitement de la page web...");
      } else if (file) {
        setStatus("📄 Extraction du texte du PDF...");
        const text = await pdfToText(file);
        if (!text || text.length < 30) throw new Error("Impossible d’extraire du texte de ce fichier.");
        body.content = text;
        body.title = file.name;
        body.source_type = "pdf";
      } else {
        throw new Error("Aucun contenu fourni (URL ou fichier).");
      }

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest-kb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");

      setStatus(`✅ Ingestion réussie : ${data.inserted || 0}/${data.attempted || 0} chunks ajoutés.`);
    } catch (e: any) {
      setStatus(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F7F6] p-6 flex flex-col items-center">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-6 border border-[#A4D4AE]/30">
        <h1 className="text-2xl font-semibold text-[#005B5F] mb-4">
          🧠 Ingestion de connaissance — Zéna
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Ajoutez une <b>page web</b> (ANACT, OMS...) ou un <b>document PDF</b> pour enrichir la
          base de connaissances de Zéna.
        </p>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Tenant ID (UUID)</span>
          <input
            type="text"
            value={tenantId}
            onChange={e => setTenantId(e.target.value)}
            placeholder="00000000-0000-0000-0000-000000000000"
            className="mt-1 w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#A4D4AE]"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">URL (facultatif)</span>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.anact.fr/article..."
            className="mt-1 w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#A4D4AE]"
          />
        </label>

        <div className="my-4 text-center text-gray-500">— ou —</div>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Fichier PDF (facultatif)</span>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="mt-1 w-full border rounded-lg p-2 bg-[#F2F7F6] cursor-pointer"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Tags (séparés par des virgules)</span>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="ANACT, QVT, Bien-être"
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
          {loading ? "⏳ Traitement en cours..." : "🚀 Lancer l’ingestion"}
        </button>

        {status && (
          <div
            className={`mt-4 text-sm rounded-lg p-3 ${
              status.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
