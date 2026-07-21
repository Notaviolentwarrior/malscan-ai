import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export type FileUploadResponse = {
  scanId: string;
  originalFilename: string;
  storedFilename: string;
  contentType: string;
  size: number;
  sha256: string;
  status: string;
  probability: number | null;
  verdict: string | null;
  modelName: string | null;
  error: string | null;
  reusedExistingResult: boolean;
  duplicateOfScanId: string | null;
  uploadedAt: string;
  analyzedAt: string | null;
  message: string;
};

export type RecentScanResponse = {
  scanId: string;
  originalFilename: string;
  status: string;
  verdict: string | null;
  probability: number | null;
  uploadedAt: string;
};

export type DashboardSummaryResponse = {
  totalScans: number;
  maliciousScans: number;
  benignScans: number;
  failedScans: number;
  averageProbability: number;
  recentScans: RecentScanResponse[];
};

export type ScanListItemResponse = {
  scanId: string;
  originalFilename: string;
  sha256: string;
  status: string;
  verdict: string | null;
  probability: number | null;
  modelName: string | null;
  error: string | null;
  duplicateOfScanId: string | null;
  uploadedAt: string;
  analyzedAt: string | null;
};

export type ScanQueryParams = {
  search?: string;
  status?: string;
  verdict?: string;
  sort?: string;
};

export async function uploadFile(
  file: File,
  forceRescan = false
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("forceRescan", String(forceRescan));

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

export async function getScans(
  params: ScanQueryParams = {}
): Promise<ScanListItemResponse[]> {
  const response = await axios.get<ScanListItemResponse[]>(`${API_BASE_URL}/scans`, {
    params,
  });

  return response.data;
}

export async function getScan(scanId: string): Promise<FileUploadResponse> {
  const response = await axios.get<FileUploadResponse>(
    `${API_BASE_URL}/scans/${scanId}`
  );

  return response.data;
}

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  const response = await axios.get<DashboardSummaryResponse>(
    `${API_BASE_URL}/scans/summary`
  );

  return response.data;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      fallbackMessage
    );
  }

  return fallbackMessage;
}
