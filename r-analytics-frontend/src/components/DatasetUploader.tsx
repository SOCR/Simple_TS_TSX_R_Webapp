import React, { useState, useRef } from 'react';
import styled from 'styled-components';


const API_URL = 'http://localhost:8000'; // R Plumber API URL

// Styled components
const UploadContainer = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 15px;
  color: #333;
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  
  &:hover, &.dragging {
    border-color: #1976d2;
    background-color: #f0f8ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Button = styled.button`
  background-color: #1976d2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  
  &:hover {
    background-color: #1565c0;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #388e3c;
  margin-top: 10px;
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  overflow-x: auto;
`;

const PreviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

interface DatasetUploaderProps {
  onUploadSuccess?: (dataInfo: any) => void;
}

const DatasetUploader: React.FC<DatasetUploaderProps> = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dataPreview, setDataPreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    // Reset states
    setError(null);
    setSuccess(null);
    setDataPreview(null);
    
    // Check file type (simple validation)
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv' || validTypes.includes(file.type)) {
      setFile(file);
    } else {
      setError('Please upload a CSV file');
      setFile(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

        console.log('Uploading file:', file);
      
      const response = await fetch(`${API_URL}/upload-dataset`, {
        method: 'POST',
        body: file, // Send the raw file data
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Upload failed');
      }
      
      setSuccess(`File "${file.name}" uploaded successfully! Rows: ${result.rows}, Columns: ${result.columns}`);
      setDataPreview(result);
      
      // Reset file after successful upload
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Call callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <UploadContainer>
      <Title>Upload Dataset</Title>
      
      <UploadArea 
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={dragging ? 'dragging' : ''}
      >
        <p>Drag & drop a CSV file here</p>
        <p>or</p>
        <Button type="button" onClick={triggerFileInput}>
          Browse Files
        </Button>
        <FileInput 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".csv"
        />
        {file && (
          <p>Selected file: {file.name}</p>
        )}
      </UploadArea>
      
      <Button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Dataset'}
      </Button>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      {dataPreview && dataPreview.preview && (
        <PreviewContainer>
          <h3>Data Preview</h3>
          <PreviewTable>
            <thead>
              <tr>
                {dataPreview.column_names.map((col: string) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataPreview.preview.map((row: any, index: number) => (
                <tr key={index}>
                  {dataPreview.column_names.map((col: string) => (
                    <td key={`${index}-${col}`}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </PreviewTable>
        </PreviewContainer>
      )}
    </UploadContainer>
  );
};

export default DatasetUploader;