import { useState } from 'react';

export const useMockIPFS = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a mock IPFS CID
      const randomHash = Array.from({ length: 46 }, () =>
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
          Math.floor(Math.random() * 62)
        )
      ).join('');

      const mockCID = `Qm${randomHash}`;

      setUploading(false);
      return mockCID;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setUploading(false);
      throw err;
    }
  };

  const uploadJSON = async (data: any): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a mock IPFS CID for JSON
      const randomHash = Array.from({ length: 46 }, () =>
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
          Math.floor(Math.random() * 62)
        )
      ).join('');

      const mockCID = `Qm${randomHash}`;

      setUploading(false);
      return mockCID;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setUploading(false);
      throw err;
    }
  };

  return {
    uploadFile,
    uploadJSON,
    uploading,
    error,
  };
};
