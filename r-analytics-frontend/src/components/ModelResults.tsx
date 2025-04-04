// src/components/ModelResults.tsx
import React from 'react';
import styled from 'styled-components';
import { ModelResults } from '../types/types';

const Container = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f0f7ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const ModelEquation = styled.div`
  font-family: 'Courier New', monospace;
  background-color: white;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 1.2em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 12px 15px;
  text-align: left;
  background-color: #e6f2ff;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
`;

const SignificanceIndicator = styled.span<{ pValue: number }>`
  font-weight: ${props => props.pValue < 0.05 ? 'bold' : 'normal'};
  color: ${props => {
    if (props.pValue < 0.001) return '#2e7d32'; // Very significant - green
    if (props.pValue < 0.01) return '#1976d2'; // Highly significant - blue
    if (props.pValue < 0.05) return '#f57c00'; // Significant - orange
    return '#c62828'; // Not significant - red
  }};
  margin-left: 8px;
`;

const getSignificanceStars = (pValue: number): string => {
  if (pValue < 0.001) return '***';
  if (pValue < 0.01) return '**';
  if (pValue < 0.05) return '*';
  return '';
};

interface ModelResultsProps {
  model: ModelResults;
}

const ModelResultsComponent: React.FC<ModelResultsProps> = ({ model }) => {
  const { intercept, slope } = model.coefficients;
  const equationSign = slope >= 0 ? '+' : '';
  
  return (
    <Container>
      <Title>Linear Regression Model</Title>
      
      <ModelEquation>
        y = {intercept.toFixed(4)} {equationSign} {slope.toFixed(4)}x
      </ModelEquation>
      
      <StatsTable>
        <thead>
          <tr>
            <Th>Statistic</Th>
            <Th>Value</Th>
            <Th>Interpretation</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Intercept</Td>
            <Td>{intercept.toFixed(4)}</Td>
            <Td>Y-value when X = 0</Td>
          </tr>
          <tr>
            <Td>Slope</Td>
            <Td>
              {slope.toFixed(4)}
              <SignificanceIndicator pValue={model.p_value}>
                {getSignificanceStars(model.p_value)}
              </SignificanceIndicator>
            </Td>
            <Td>Change in Y for each unit increase in X</Td>
          </tr>
          <tr>
            <Td>R-squared</Td>
            <Td>{model.r_squared.toFixed(4)}</Td>
            <Td>Proportion of variance explained by the model</Td>
          </tr>
          <tr>
            <Td>Adjusted R-squared</Td>
            <Td>{model.adj_r_squared.toFixed(4)}</Td>
            <Td>R-squared adjusted for number of predictors</Td>
          </tr>
          <tr>
            <Td>Residual Std Error</Td>
            <Td>{model.residual_std_error.toFixed(4)}</Td>
            <Td>Standard deviation of residuals</Td>
          </tr>
          <tr>
            <Td>P-value (slope)</Td>
            <Td>
              {model.p_value < 0.001 ? '< 0.001' : model.p_value.toFixed(4)}
              <SignificanceIndicator pValue={model.p_value}>
                {getSignificanceStars(model.p_value)}
              </SignificanceIndicator>
            </Td>
            <Td>
              {model.p_value < 0.05 
                ? 'Significant relationship between X and Y'
                : 'No significant relationship detected'}
            </Td>
          </tr>
        </tbody>
      </StatsTable>
      
      <div style={{ fontSize: '0.8em', marginTop: '10px', color: '#666' }}>
        Significance codes: '***' 0.001, '**' 0.01, '*' 0.05
      </div>
    </Container>
  );
};

export default ModelResultsComponent;
