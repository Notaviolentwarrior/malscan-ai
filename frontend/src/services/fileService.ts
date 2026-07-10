import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export type FileUploadResponse = {
  originalFilename: string;
  storedFilename: string;
  contentType: string;
  size: number;
  sha256: string;
  message: string;
};

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<FileUploadResponse>(
    `${API_BASE_URL}/files/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
