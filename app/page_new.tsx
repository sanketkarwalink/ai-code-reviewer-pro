'use client';

import React, { useState } from 'react';
import { Send, Code, AlertCircle, CheckCircle, Loader, Wrench, Copy, RefreshCw } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [error, setError] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [showFixedCode, setShowFixedCode] = useState(false);

  const languages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby'
  ];

  const analyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setReview(null);
    setShowFixedCode(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setReview(data.review);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fixCode = async () => {
    if (!review || !code.trim()) {
      setError('Please analyze the code first');
      return;
    }

    setFixing(true);
    setError('');

    try {
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: (review as any).detected_language || language,
          issues: (review as any).issues || []
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Fix failed');
      }

      setFixedCode(data.fixResult.fixed_code);
      setShowFixedCode(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setFixing(false);
    }
  };

  const applyFix = () => {
    setCode(fixedCode);
    setShowFixedCode(false);
    setReview(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Code className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">AI Code Reviewer</h1>
          </div>
          <p className="text-gray-600 text-lg">Get instant AI-powered feedback on your code</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Code</h2>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            
            <button
              onClick={analyzeCode}
              disabled={loading || !code.trim()}
              className="mt-4 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Analyze Code
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
            
            {!review && !loading && (
              <div className="text-center py-12 text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Submit your code to see the analysis</p>
              </div>
            )}
            
            {loading && (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-indigo-600" />
                <p className="text-gray-600">AI is reviewing your code...</p>
              </div>
            )}

            {review && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Language Warning */}
                {(review as any).language_warning && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-yellow-800 text-sm">{(review as any).language_warning}</p>
                    </div>
                  </div>
                )}

                {/* Overall Score */}
                {(review as any).overall_score && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Overall Score</span>
                      <span className="text-2xl font-bold text-green-600">
                        {(review as any).overall_score}/10
                      </span>
                    </div>
                  </div>
                )}

                {/* Auto-Fix Button */}
                {(review as any).issues && (review as any).issues.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={fixCode}
                      disabled={fixing}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      {fixing ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Fixing...
                        </>
                      ) : (
                        <>
                          <Wrench className="w-4 h-4 mr-2" />
                          Auto-Fix Issues
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Issues */}
                {(review as any).issues && (review as any).issues.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Issues Found</h3>
                    {(review as any).issues.map((issue: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg border mb-2 ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{issue.type || 'Issue'}</h4>
                            <p className="text-sm mt-1">{issue.description}</p>
                            {issue.line && (
                              <span className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">
                                Line {issue.line}
                              </span>
                            )}
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-white font-medium">
                            {issue.severity || 'Medium'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {(review as any).suggestions && (review as any).suggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Suggestions</h3>
                    {(review as any).suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg mb-2">
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-green-800 text-sm">{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                {(review as any).summary && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{(review as any).summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Code Section */}
        {showFixedCode && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-green-600" />
                Auto-Fixed Code
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(fixedCode)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center text-sm transition-colors"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
                <button
                  onClick={applyFix}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Apply Fix
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono text-gray-800">
                {fixedCode}
              </pre>
            </div>
          </div>
        )}

        {/* Demo Examples */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Try These Examples</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setCode(`function findMax(arr) {
  let max = 0;
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`)}
              className="text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">JavaScript Function</h4>
              <p className="text-sm text-gray-600">A function with potential bugs</p>
            </button>
            
            <button
              onClick={() => setCode(`def process_data(data):
    result = []
    for item in data:
        if item != None:
            result.append(item * 2)
    return result`)}
              className="text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Python Function</h4>
              <p className="text-sm text-gray-600">Data processing with room for improvement</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
