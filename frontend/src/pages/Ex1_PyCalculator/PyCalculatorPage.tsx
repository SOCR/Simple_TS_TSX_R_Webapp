import React, { useState } from 'react';
import pythonCalculatorApi, { CalculatorOperation } from '../../services/pyCalcApiClient';

const PyCalculatorPage: React.FC = () => {
  // State for form inputs
  const [num1, setNum1] = useState<number | ''>('');
  const [num2, setNum2] = useState<number | ''>('');
  const [operation, setOperation] = useState<CalculatorOperation>('add');
  
  // State for results and UI state
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle calculation
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (num1 === '' || num2 === '') {
      setError('Please enter both numbers');
      return;
    }

    // Clear previous results/errors
    setError(null);
    setLoading(true);
    
    try {
      // Call the API
      const response = await pythonCalculatorApi.calculate(
        Number(num1),
        Number(num2),
        operation
      );
      
      // Update state with result
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Python Calculator</h1>
          <p className="text-gray-600 mt-2">Perform basic calculations with a Python backend</p>
        </div>
        
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="num1" className="block text-sm font-medium text-gray-700">
                First Number
              </label>
              <input
                type="number"
                id="num1"
                value={num1}
                onChange={(e) => setNum1(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter a number"
              />
            </div>
            <div>
              <label htmlFor="num2" className="block text-sm font-medium text-gray-700">
                Second Number
              </label>
              <input
                type="number"
                id="num2"
                value={num2}
                onChange={(e) => setNum2(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter a number"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="operation" className="block text-sm font-medium text-gray-700">
              Operation
            </label>
            <select
              id="operation"
              value={operation}
              onChange={(e) => setOperation(e.target.value as CalculatorOperation)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="add">Addition (+)</option>
              <option value="subtract">Subtraction (-)</option>
              <option value="multiply">Multiplication (×)</option>
              <option value="divide">Division (÷)</option>
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result !== null && !error && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h2 className="text-lg font-medium text-gray-800">Result</h2>
            <div className="mt-2 text-2xl font-bold text-indigo-600">
              {result}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {num1} {operation === 'add' ? '+' : operation === 'subtract' ? '-' : operation === 'multiply' ? '×' : '÷'} {num2} = {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PyCalculatorPage;
