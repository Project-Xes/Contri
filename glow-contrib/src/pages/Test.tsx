import { useState } from 'react';

const Test = () => {
  const [result, setResult] = useState<string>('');

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/health');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <button 
        onClick={testAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Test API Connection
      </button>
      <pre className="bg-gray-100 p-4 rounded">
        {result || 'Click the button to test API connection'}
      </pre>
    </div>
  );
};

export default Test;

