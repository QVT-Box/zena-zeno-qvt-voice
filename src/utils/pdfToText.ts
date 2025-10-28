import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

/**
 * Convertit un PDF en texte brut.
 * @param file Le fichier PDF (File ou Blob)
 * @returns Le texte extrait
 */
export async function pdfToText(file: File | Blob): Promise<string> {
  try {
    // ✅ Spécifie explicitement le worker local
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("❌ Erreur lors de la lecture du PDF :", error);
    throw new Error("Impossible d’extraire le texte du PDF.");
  }
}
