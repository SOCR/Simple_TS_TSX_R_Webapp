import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface DRGRequest {
  original_file: string;
  obfuscated_files: string[];
  replications: number;
  choose_targets: 'random' | 'specified';
  targets?: string;
  choose_features: 'random' | 'specified';
  complexity?: string;
  features?: string[];
  radius: string;
}

export interface DRGResponse {
  scores: {
    File: string;
    Complexity: number;
    Radius: number;
    Score: number;
  }[];
  complexity: {
    File: string;
    Complexity: number;
    Score: number;
  }[];
  radius: {
    File: string;
    Radius: number;
    Score: number;
  }[];
  distances: Record<string, any>;
  x_targets: number[][];
  p_sets: number[];
  deltas: number[];
  random_targets: boolean;
  random_features: boolean;
  features_selected: number[][];
}

export interface PlotResponse {
  scores: any;
  complexity: any;
  radius: any;
}

export interface DistancePlotRequest {
  distances: any;
  radius: number;
  target_distance: number;
}

const api = {
  calculateDRG: async (data: DRGRequest): Promise<DRGResponse> => {
    const response = await axios.post(`${API_BASE_URL}/calculate`, data);
    return response.data;
  },

  getFeatures: async (originalFile: string): Promise<string[]> => {
    const response = await axios.get(`${API_BASE_URL}/features`, {
      params: { original_file: originalFile }
    });
    return response.data.features;
  },

  generatePlots: async (scoresData: any): Promise<PlotResponse> => {
    const response = await axios.post(`${API_BASE_URL}/plots`, scoresData);
    return response.data;
  },

  generateDistancePlot: async (data: DistancePlotRequest): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/distance-plot`, data);
    return response.data;
  }
};

export default api; 