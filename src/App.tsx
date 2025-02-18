import React, { useState } from 'react';
import { Languages, Send, AlertCircle } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleTranslate = async () => {
    if (!text) return;
    
    setLoading(true);
    setError('');
    setTranslation('');
    
    try {
      const response = await fetch('http://localhost:3000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed. Please try again.');
      }
      
      if (!data.translation) {
        throw new Error('No translation received. Please try again.');
      }
      
      setTranslation(data.translation);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
      
      setError(errorMessage);
      console.error('Translation failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Languages className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">AI Translator</h1>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Language
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Italian</option>
              <option>Portuguese</option>
              <option>Chinese</option>
              <option>Japanese</option>
              <option>Korean</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Italian</option>
              <option>Portuguese</option>
              <option>Chinese</option>
              <option>Japanese</option>
              <option>Korean</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text to Translate
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter text to translate..."
            />
          </div>
          
          <button
            onClick={handleTranslate}
            disabled={loading || !text}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Translating...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Translate
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {translation && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Translation</h2>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-800">{translation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;