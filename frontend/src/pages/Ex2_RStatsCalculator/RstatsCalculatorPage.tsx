import React, { useState } from 'react';
import rStatsApi from '../../services/rStatsApiClient';

const RStatsCalculatorPage: React.FC = () => {
  // State for input and results
  const [inputNumbers, setInputNumbers] = useState<string>('');
  const [statsResult, setStatsResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous results and errors
    setStatsResult(null);
    setError(null);
    
    // Validate input
    if (!inputNumbers.trim()) {
      setError('Please enter some numbers');
      return;
    }
    
    // Parse input string to array of numbers
    const numbersArray: number[] = [];
    const inputValues = inputNumbers.split(',');
    
    for (const value of inputValues) {
      const num = Number(value.trim());
      if (isNaN(num)) {
        setError(`"${value.trim()}" is not a valid number`);
        return;
      }
      numbersArray.push(num);
    }
    
    setLoading(true);
    
    try {
      // Call the API to get statistics
      const result = await rStatsApi.getStats(numbersArray);
      setStatsResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Render a statistic with label and value
  const renderStat = (label: string, value: any) => (
    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="font-mono">{typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 4 }) : value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">R Statistics Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate statistics using R backend</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="numbers" className="block text-sm font-medium text-gray-700">
              Enter Numbers (comma-separated)
            </label>
            <textarea
              id="numbers"
              value={inputNumbers}
              onChange={(e) => setInputNumbers(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-24"
              placeholder="Example: 5, 10, 15, 20, 25"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a list of numbers separated by commas
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Calculating...' : 'Calculate Statistics'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {statsResult && !error && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Statistics Results</h2>
            
            <div className="space-y-1">
              {renderStat('Count', statsResult.count)}
              {renderStat('Sum', statsResult.sum)}
              {renderStat('Mean (Average)', statsResult.mean)}
              {renderStat('Median', statsResult.median)}
              {renderStat('Mode', statsResult.mode)}
              {renderStat('Minimum', statsResult.min)}
              {renderStat('Maximum', statsResult.max)}
              {renderStat('Range', statsResult.range)}
              {renderStat('Standard Deviation', statsResult.std_dev)}
              {renderStat('Variance', statsResult.variance)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RStatsCalculatorPage;
