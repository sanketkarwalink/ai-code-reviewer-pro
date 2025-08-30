'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface Provider {
  name: string;
  enabled: boolean;
  hasApiKey: boolean;
  requestCount: number;
  requestsPerMinute: number;
  lastUsed: number;
}

interface ProviderRecommendation {
  name: string;
  description: string;
  signupUrl: string;
  envVar: string;
  priority: number;
  setup: string;
}

interface ProvidersData {
  providers: Provider[];
  totalEnabled: number;
  availableProviders: any[];
  additionalProviders: ProviderRecommendation[];
}

export default function ProvidersStatus() {
  const [data, setData] = useState<ProvidersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/providers');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset' })
      });
      
      if (response.ok) {
        await fetchProviders(); // Refresh the data
      }
    } catch (error) {
      console.error('Failed to reset providers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const getProviderStatus = (provider: Provider) => {
    if (!provider.hasApiKey) return { color: 'text-gray-500', icon: XCircle, status: 'No API Key' };
    if (!provider.enabled) return { color: 'text-red-500', icon: XCircle, status: 'Disabled' };
    if (provider.requestCount >= provider.requestsPerMinute) return { color: 'text-yellow-500', icon: Clock, status: 'Rate Limited' };
    return { color: 'text-green-500', icon: CheckCircle, status: 'Available' };
  };

  const formatLastUsed = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Cpu className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">AI Providers</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-green-600">{data?.totalEnabled || 0}</span> active
          </div>
          <button
            onClick={resetProviders}
            disabled={loading}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Reset All
          </button>
          <button
            onClick={fetchProviders}
            disabled={loading}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Provider Status */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Current Providers</h3>
        <div className="space-y-3">
          {data?.providers.map((provider) => {
            const status = getProviderStatus(provider);
            return (
              <div key={provider.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <status.icon className={`w-5 h-5 mr-3 ${status.color}`} />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{provider.name}</p>
                    <p className={`text-sm ${status.color}`}>{status.status}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>{provider.requestCount}/{provider.requestsPerMinute} requests</div>
                  <div>Last used: {formatLastUsed(provider.lastUsed)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations for additional providers */}
      {data && data.totalEnabled < 4 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Add More Free Providers</h3>
          <div className="space-y-3">
            {data.additionalProviders.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-1 mr-4">
                  <p className="font-medium text-blue-900 capitalize">{provider.name}</p>
                  <p className="text-sm text-blue-700 mb-2">{provider.description}</p>
                  <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded font-mono whitespace-pre-line">
                    {provider.setup}
                  </div>
                </div>
                <a
                  href={provider.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm transition-colors"
                >
                  Sign Up Free
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      {data && data.totalEnabled === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ No AI Providers Available</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Add at least one API key to your .env.local file to start using the code reviewer.
          </p>
          <div className="text-xs text-yellow-600 font-mono bg-yellow-100 p-2 rounded">
            OPENAI_API_KEY=your_key_here<br/>
            GROQ_API_KEY=your_key_here<br/>
            HUGGINGFACE_API_KEY=your_key_here
          </div>
        </div>
      )}
    </div>
  );
}
