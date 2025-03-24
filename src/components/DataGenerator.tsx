// src/components/DataGenerator.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { DataSet } from '../types/types';

const Container = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FieldGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Label = styled.label`
  font-weight: bold;
  min-width: 180px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DataPreview = styled.div`
  margin-top: 15px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  background-color: white;
  font-family: monospace;
  font-size: 0.9em;
`;

interface DataGeneratorProps {
  onDataGenerated: (data: DataSet) => void;
  isLoading: boolean;
}

const DataGenerator: React.FC<DataGeneratorProps> = ({ onDataGenerated, isLoading }) => {
  const [sampleSize, setSampleSize] = useState<number>(100);
  const [correlation, setCorrelation] = useState<number>(0.7);
  const [noise, setNoise] = useState<number>(0.3);
  const [generatedData, setGeneratedData] = useState<DataSet | null>(null);

  const generateData = () => {
    // Generate correlated x and y values
    const x: number[] = [];
    const y: number[] = [];
    
    for (let i = 0; i < sampleSize; i++) {
      // Generate x values between 0 and 10
      const xVal = Math.random() * 10;
      x.push(xVal);
      
      // Generate y with some correlation to x plus noise
      const yVal = (correlation * xVal) + ((1 - correlation) * Math.random() * 10) + (Math.random() * noise * 2 - noise);
      y.push(yVal);
    }
    
    const data: DataSet = { x, y };
    setGeneratedData(data);
    return data;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = generateData();
    onDataGenerated(data);
  };

  const handleGenerate = () => {
    generateData();
  };

  return (
    <Container>
      <h2>Data Generator</h2>
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label htmlFor="sampleSize">Sample Size:</Label>
          <Input
            id="sampleSize"
            type="number"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            min="10"
            max="1000"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="correlation">Correlation Strength:</Label>
          <Input
            id="correlation"
            type="number"
            value={correlation}
            onChange={(e) => setCorrelation(parseFloat(e.target.value))}
            min="-1"
            max="1"
            step="0.1"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="noise">Noise Level:</Label>
          <Input
            id="noise"
            type="number"
            value={noise}
            onChange={(e) => setNoise(parseFloat(e.target.value))}
            min="0"
            max="5"
            step="0.1"
          />
        </FieldGroup>

        <ButtonGroup>
          <Button type="button" onClick={handleGenerate}>
            Generate Data
          </Button>
          <Button type="submit" disabled={!generatedData || isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze with R'}
          </Button>
        </ButtonGroup>
      </Form>

      {generatedData && (
        <DataPreview>
          <div>Generated {generatedData.x.length} data points</div>
          <div>First 5 points:</div>
          {generatedData.x.slice(0, 5).map((x, i) => (
            <div key={i}>
              [{i}]: x = {x.toFixed(2)}, y = {generatedData.y[i].toFixed(2)}
            </div>
          ))}
        </DataPreview>
      )}
    </Container>
  );
};

export default DataGenerator;