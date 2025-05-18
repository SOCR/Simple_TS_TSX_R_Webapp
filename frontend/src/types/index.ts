export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
  }
export interface FileUploadResponse {
  success: boolean;
  message: string;
  filename?: string;
  fileSize?: number;
  // Add any other properties your API returns
}

export interface FileInfo {
  filename: string;
  // Add other properties if available
}

export interface FilesResponse {
  files: string[];
}