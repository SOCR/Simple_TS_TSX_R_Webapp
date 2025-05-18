// src/api/fileApi.ts

import axios from 'axios';
import { FileInfo, FilesResponse } from '../types/index';

// Define the base URL for the Python backend
const API_BASE_URL = import.meta.env.VITE_PYTHON_API_URL;

// File listing API client
export const fileApi = {
  // Get list of files
  getFiles: async (): Promise<FileInfo[]> => {
    try {
      const response = await axios.get<FilesResponse>(
        `${API_BASE_URL}/files`
      );
      
      // Transform the string array into an array of FileInfo objects
      const fileInfoArray: FileInfo[] = response.data.files.map(filename => ({
        filename
      }));
      
      return fileInfoArray;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Failed to fetch files');
      }
      throw new Error('Failed to connect to the file listing service');
    }
  }
};

export default fileApi;