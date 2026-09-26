import api from "@/providers/axios";
import { ApplicationInput } from "./type";

/**
 * Sends the application and the CV in one multipart request to the dedicated
 * endpoint (the CV is stored privately; the public can't upload to `media`).
 */
export async function submitApplication(
  input: ApplicationInput,
  cv: File,
  locale: string,
): Promise<{ id: number }> {
  const formData = new FormData();
  formData.append("file", cv);
  formData.append("_payload", JSON.stringify(input));

  const response = await api.post("/applications/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { locale },
  });

  return response.data.doc;
}
