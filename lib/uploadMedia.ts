import api from "@/providers/axios";

/**
 * Uploads a single file to Payload's built-in `media` collection and
 * returns the created media document's id. Used to attach files to a
 * QuoteRequest submission, since Payload's upload fields store a
 * relationship to an existing media doc, not the raw file itself.
 */
export async function uploadMedia(file: File): Promise<number> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.doc.id;
}