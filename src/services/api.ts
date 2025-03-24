// src/services/api.ts
import axios from 'axios';
import { DataSet, AnalysisResults } from '../types/types';

const API_URL = 'http://localhost:8000'; // R Plumber API URL

export const analyzeData = async (data: DataSet): Promise<AnalysisResults> => {
  try {
    const response = await axios.post(
      `${API_URL}/analyze`, 
      JSON.stringify(data), 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing data:', error);
    throw error;
  }
};