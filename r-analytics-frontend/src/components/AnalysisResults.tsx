// src/components/AnalysisResults.tsx
import React from 'react';
import styled from 'styled-components';
import { AnalysisResults } from '../types/types';
import SummaryStats from './SummaryStats.tsx';
import ModelResults from './ModelResults.tsx';
import PlotDisplay from './PlotDisplay.tsx';

const Container = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h2`
  margin: 0;
  color: #2c3e50;
`;

const Timestamp = styled.div`
  color: #7f8c8d;
  font-size: 0.9em;
`;

interface AnalysisResultsComponentProps {
  results: AnalysisResults;
}

const AnalysisResultsComponent: React.FC<AnalysisResultsComponentProps> = ({ results }) => {
  return (
    <Container>
      <Header>
        <Title>R Analysis Results</Title>
        <Timestamp>Generated on {new Date().toLocaleString()}</Timestamp>
      </Header>

      <SummaryStats stats={results.summary_stats} />
      <ModelResults model={results.model_results} />
      <PlotDisplay plots={results.plots} />
    </Container>
  );
};

export default AnalysisResultsComponent;
