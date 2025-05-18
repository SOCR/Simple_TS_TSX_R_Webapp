import { useState, useEffect } from 'react';
import axios from 'axios';

// Define types
interface UploadedFile {
  id: string;
  filename: string;
  uploadDate: string;
  size: number;
}

interface ConfigOption {
  id: string;
  name: string;
  cpu: string;
  memory: string;
}

export default function ObfuscationPage() {
  // State
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [outputPrefix, setOutputPrefix] = useState<string>('');
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(true);

  // API URLs - replace with your actual endpoints
  const PYTHON_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const R_PLUMBER_URL = import.meta.env.VITE_R_PLUMBER_URL || 'http://localhost:8080';

  // Load uploaded files on component mount
  useEffect(() => {
    fetchUploadedFiles();
    fetchConfigOptions();
  }, []);

  const fetchUploadedFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const response = await axios.get(`${PYTHON_API_URL}/files`);
      console.log(response.data)
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch uploaded files:', error);
      setStatus('Error loading files. Please try again.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const fetchConfigOptions = async () => {
    try {
      const response = await axios.get(`${R_PLUMBER_URL}/obfuscator/obfuscation_config`);
      if (response.data.length > 0) {
        setSelectedConfigId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch configuration options:', error);
    }
  };

  const handleRunTask = async () => {
    if (!selectedFileId) {
      setStatus('Please select a file first');
      return;
    }

    if (!outputPrefix.trim()) {
      setStatus('Please enter an output prefix');
      return;
    }

    if (!selectedConfigId) {
      setStatus('Please select a configuration');
      return;
    }

    setIsLoading(true);
    setStatus('Running task...');

    try {
      // Find the selected file and config objects
      const selectedFile = files.find(file => file.id === selectedFileId);
      const selectedConfig = configOptions.find(config => config.id === selectedConfigId);

      // Make request to R plumber backend
      const response = await axios.post(`${R_PLUMBER_URL}/run-task`, {
        fileId: selectedFileId,
        filename: selectedFile?.filename,
        outputPrefix: outputPrefix.trim(),
        config: {
          id: selectedConfigId,
          cpu: selectedConfig?.cpu,
          memory: selectedConfig?.memory
        }
      });

      setStatus(`Task started successfully! Job ID: ${response.data.jobId}`);
    } catch (error) {
      console.error('Failed to run task:', error);
      setStatus('Error running task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Run Analysis Task</h1>
      
      {/* File Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Select File
        </label>
        {isLoadingFiles ? (
          <div className="text-gray-500">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="text-gray-500">No files available. Please upload files first.</div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {files.map(file => (
                <div 
                  key={file.id} 
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedFileId === file.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedFileId(file.id)}
                >
                  <div>
                    <div className="font-medium">{file.filename}</div>
                    <div className="text-xs text-gray-500">
                      Uploaded: {new Date(file.uploadDate).toLocaleString()} • 
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  {selectedFileId === file.id && (
                    <div className="text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Output Prefix */}
      <div className="mb-6">
        <label htmlFor="outputPrefix" className="block text-gray-700 font-medium mb-2">
          Task Output Prefix
        </label>
        <input
          type="text"
          id="outputPrefix"
          value={outputPrefix}
          onChange={(e) => setOutputPrefix(e.target.value)}
          placeholder="Enter prefix for output files"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Configuration Selection */}
      <div className="mb-8">
        <label htmlFor="config" className="block text-gray-700 font-medium mb-2">
          Configuration
        </label>
        <select
          id="config"
          value={selectedConfigId}
          onChange={(e) => setSelectedConfigId(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {configOptions.length === 0 ? (
            <option value="">Loading configurations...</option>
          ) : (
            configOptions.map(config => (
              <option key={config.id} value={config.id}>
                {config.name} (CPU: {config.cpu}, Memory: {config.memory})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Run Task Button */}
      <button
        onClick={handleRunTask}
        disabled={isLoading || !selectedFileId || !outputPrefix.trim() || !selectedConfigId}
        className={`w-full py-3 rounded font-medium text-white 
          ${isLoading || !selectedFileId || !outputPrefix.trim() || !selectedConfigId
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Processing...' : 'Run Task'}
      </button>

      {/* Status Message */}
      {status && (
        <div className={`mt-4 p-3 rounded ${status.includes('Error') 
          ? 'bg-red-100 text-red-700' 
          : status.includes('success') 
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'}`}>
          {status}
        </div>
      )}
    </div>
  );
}