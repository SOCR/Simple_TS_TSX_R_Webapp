import axios from 'axios';

// Define the base URL for the R backend
const API_BASE_URL = import.meta.env.VITE_R_API_URL; // Adjust based on your R Plumber port

// Define the response type for stats operations
interface StatsResponse {
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  range: number;
  std_dev: number;
  variance: number;
  sum: number;
  count: number;
}

// R Stats API client
export const rStatsApi = {
  // Check if the API is available
  checkStatus: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      return response.status === 200;
    } catch (error) {
      console.error('Failed to connect to R backend:', error);
      return false;
    }
  },
  
  // Calculate statistics for a list of numbers
  getStats: async (numbers: number[]): Promise<StatsResponse> => {
    try {
      // Instead of sending as query params, send as request body
      const response = await axios.post<StatsResponse>(
        `${API_BASE_URL}/stats`,
        { numbers: numbers } // Send as JSON object in request body
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to connect to the statistics service');
    }
  }
};

export default rStatsApi; 