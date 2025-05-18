// src/api/uploadFileApi.ts (or whatever your current path is)

import axios from 'axios';
import { FileUploadResponse } from '../types/index';

// Define the base URL for the Python backend
const API_BASE_URL = import.meta.env.VITE_PYTHON_API_URL;

// File Upload API client
export const uploadFileApi = {
  // Check if the API is available
  checkStatus: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      return response.status === 200;
    } catch (error) {
      console.error('Failed to connect to Python backend:', error);
      return false;
    }
  },
  
  // Upload a file to the backend
  upload: async (file: File): Promise<FileUploadResponse> => {
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post<FileUploadResponse>(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'File upload failed');
      }
      throw new Error('Failed to connect to the file upload service');
    }
  }
};

export default uploadFileApi;