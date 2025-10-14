import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface OnboardingUploadProps {
  tenantId: string;
  onComplete?: () => void;
}

export default function OnboardingUpload({ tenantId, onComplete }: OnboardingUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(f => {
        const ext = f.name.toLowerCase();
        return ext.endsWith('.txt') || ext.endsWith('.md');
      });
      
      if (validFiles.length !== selectedFiles.length) {
        toast.warning("Seuls les fichiers TXT et MD sont supportés pour le moment");
      }
      
      setFiles(validFiles);
    }
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }

    setUploading(true);
    setProgress("Préparation de l'upload...");

    try {
      const objects: { path: string; name: string; mime: string }[] = [];

      // Upload des fichiers dans Storage
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Upload ${i + 1}/${files.length}: ${file.name}`);

        const key = `tenants/${tenantId}/kb/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("kb")
          .upload(key, file, { upsert: false });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Erreur d'upload: ${uploadError.message}`);
        }

        objects.push({ path: key, name: file.name, mime: file.type });
      }

      // Lancer l'ingestion
      setProgress("Indexation des documents...");

      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        throw new Error("Session non trouvée");
      }

      const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
      const res = await fetch(`${FUNCTIONS_URL}/ingest-kb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          objects,
          lang: "fr",
          tags: ["QVT", "Interne"],
          bucket: "kb",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Ingestion error:", data);
        throw new Error(data.error || "Erreur lors de l'indexation");
      }

      toast.success("Documents indexés avec succès ✅");
      setProgress("Terminé ✅");
      setFiles([]);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error("Upload/Ingestion error:", error);
      toast.error(error.message || "Erreur lors du traitement des fichiers");
      setProgress("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Importer vos documents QVT</h2>
          <p className="text-sm text-muted-foreground">
            Uploadez vos documents pour que l'IA puisse les utiliser dans ses réponses.
            <br />
            <span className="text-xs">Formats supportés : TXT, MD</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              multiple
              accept=".txt,.md"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FileText className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm font-medium">
                Cliquez pour sélectionner des fichiers
              </span>
              <span className="text-xs text-muted-foreground">
                ou glissez-déposez vos fichiers ici
              </span>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Fichiers sélectionnés :</p>
              <div className="space-y-1">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm p-2 bg-muted rounded"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="flex-1">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {progress && (
            <div className="p-4 bg-primary/10 rounded-lg flex items-center gap-2">
              {progress.includes("✅") ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-primary animate-pulse" />
              )}
              <span className="text-sm">{progress}</span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!files.length || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? "Traitement en cours..." : "Lancer l'indexation"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>ℹ️ Les documents seront découpés en sections et indexés pour une recherche rapide.</p>
          <p>ℹ️ L'IA utilisera ces contenus pour personnaliser ses réponses à votre entreprise.</p>
        </div>
      </div>
    </Card>
  );
}
