import axios from 'axios';

// Define the base URL for the Python backend
const API_BASE_URL = import.meta.env.VITE_PYTHON_API_URL; // Adjust based on your FastAPI port

// Define the response type for calculator operations
interface CalculatorResponse {
  result: number;
  operation: string;
  num1: number;
  num2: number;
}

// Define the available operations
export type CalculatorOperation = 'add' | 'subtract' | 'multiply' | 'divide';

// Python Calculator API client
export const pythonCalculatorApi = {
  
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
  
  // Calculate using the specified operation
  calculate: async (
    num1: number, 
    num2: number, 
    operation: CalculatorOperation
  ): Promise<CalculatorResponse> => {
    try {
      const response = await axios.post<CalculatorResponse>(
        `${API_BASE_URL}/calculate`, 
        { num1, num2, operation }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Calculation failed');
      }
      throw new Error('Failed to connect to the calculation service');
    }
  }
};

export default pythonCalculatorApi;