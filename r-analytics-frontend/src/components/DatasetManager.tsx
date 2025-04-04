import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatasetUploader from './DatasetUploader.tsx';


const API_URL = 'http://localhost:8000'; // R Plumber API URL

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const DatasetList = styled.div`
  margin-top: 30px;
`;

const DatasetCard = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &.selected {
    border-left: 4px solid #1976d2;
  }
`;

const DatasetName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const DatasetInfo = styled.div`
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #1976d2;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const NoDatasets = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  color: #666;
`;

interface Dataset {
  filename: string;
  rows?: number;
  columns?: number;
}

interface DatasetManagerProps {
  onSelectDataset?: (datasetInfo: any) => void;
}

const DatasetManager: React.FC<DatasetManagerProps> = ({ onSelectDataset }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Load available datasets on component mount
  useEffect(() => {
    fetchDatasets();
  }, []);
  
  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/datasets`);
      const data = await response.json();
      
      if (data.datasets) {
        // Convert to our Dataset interface format
        const formattedDatasets = data.datasets.map((filename: string) => ({
          filename
        }));
        
        setDatasets(formattedDatasets);
      }
    } catch (err) {
      setError('Failed to load datasets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDatasetSelect = async (filename: string) => {
    try {
      setSelectedDataset(filename);
      
      const response = await fetch(`${API_URL}/dataset-info?filename=${encodeURIComponent(filename)}`);
      const dataInfo = await response.json();
      
      if (dataInfo.success && onSelectDataset) {
        onSelectDataset(dataInfo);
      }
    } catch (err) {
      console.error('Error fetching dataset info:', err);
    }
  };
  
  const handleUploadSuccess = (dataInfo: any) => {
    // Refresh the list of datasets
    fetchDatasets();
    
    // Automatically select the newly uploaded dataset
    if (dataInfo.filename && onSelectDataset) {
      setSelectedDataset(dataInfo.filename);
      onSelectDataset(dataInfo);
    }
  };
  
  return (
    <Container>
      <DatasetUploader onUploadSuccess={handleUploadSuccess} />
      
      <DatasetList>
        <h2>Available Datasets</h2>
        
        {loading && <p>Loading datasets...</p>}
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && datasets.length === 0 && (
          <NoDatasets>
            <p>No datasets available. Upload one to get started!</p>
          </NoDatasets>
        )}
        
        {datasets.map((dataset) => (
          <DatasetCard 
            key={dataset.filename}
            className={selectedDataset === dataset.filename ? 'selected' : ''}
            onClick={() => handleDatasetSelect(dataset.filename)}
          >
            <DatasetName>{dataset.filename}</DatasetName>
            <DatasetInfo>
              <div>
                {dataset.rows && dataset.columns ? (
                  <span>{dataset.rows} rows × {dataset.columns} columns</span>
                ) : (
                  <span>Click to view details</span>
                )}
              </div>
              <div>
                <Button onClick={(e) => {
                  e.stopPropagation();
                  handleDatasetSelect(dataset.filename);
                }}>
                  Select
                </Button>
              </div>
            </DatasetInfo>
          </DatasetCard>
        ))}
      </DatasetList>
    </Container>
  );
};

export default DatasetManager;