import { useState, useRef, useEffect } from 'react';
import uploadFileApi from '@/services/uploadApiClient';
import fileApi from '@/services/fileApiClient';
import { FileInfo } from '../types/index';

export default function UploadPage() {

  const [fileList, setFileList] = useState<FileInfo[]>([]); // Update state type
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setUploadStatus(null);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  

  const fetchFiles = async () => {
    try {
      const files = await fileApi.getFiles();
      setFileList(files);
    } catch (error) {
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadStatus("Uploading...");
    
    try {
        const response = await uploadFileApi.upload(selectedFile);
        
        if (response.success) {
          setUploadStatus("File uploaded successfully!");
          setSelectedFile(null);
        } else {
          setUploadStatus(`Upload failed: ${response.message}`);
        }
      } catch (error) {
        setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
        fetchFiles();
      }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    

    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Upload your datasets here!</h1>
        </div>
      <div className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-sm text-gray-600 mb-5">Click the button below to select a (csv) file</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={isUploading}
        >
          Select File
        </button>
        
        {selectedFile && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>
            <p className="text-xs text-gray-500">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
        
        {uploadStatus && (
          <div className={`mt-4 text-sm ${uploadStatus.includes("successfully") ? "text-green-600" : uploadStatus === "Uploading..." ? "text-blue-600" : "text-red-600"}`}>
            {uploadStatus}
          </div>
        )}
      </div>

        {fileList.length > 0 && (
          <div className="mt-6 w-full"> 
            <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
            <ul className="list-disc pl-5">
              {fileList.map((file) => (
                <li key={file.filename} className="text-sm text-gray-700">
                  {file.filename}
                </li>
              ))}
            </ul>
          </div>
        )
        }
    </div>
  );
}