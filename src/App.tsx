// src/App.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import DataGenerator from './components/DataGenerator';
import AnalysisResults from './components/AnalysisResults';
import { analyzeData } from './services/api';
import { AnalysisResults as AnalysisResultsType, DataSet } from './types/types';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.2em;
  margin-top: 0;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
  color: #2c3e50;
  font-size: 1.2em;
`;

const ErrorMessage = styled.div`
  background-color: #ffeded;
  color: #c0392b;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  border-left: 5px solid #e74c3c;
`;

function App() {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResultsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataGenerated = async (data: DataSet) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await analyzeData(data);
      setAnalysisResults(results);
    } catch (err) {
      setError('Error analyzing data with R. Make sure the R Plumber API is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>R Analytics in React</Title>
        <Subtitle>Connecting TypeScript/React with R Plumber API</Subtitle>
      </Header>

      <DataGenerator onDataGenerated={handleDataGenerated} isLoading={loading} />
      
      {loading && (
        <LoadingIndicator>
          <div>
            <div>Analyzing data in R...</div>
            <div style={{ fontSize: '0.8em', marginTop: '10px' }}>
              Processing request through R Plumber API
            </div>
          </div>
        </LoadingIndicator>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && analysisResults && <AnalysisResults results={analysisResults} />}
    </AppContainer>
  );
}

export default App;
