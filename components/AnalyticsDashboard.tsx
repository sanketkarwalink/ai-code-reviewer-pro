'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Code2, Clock, Award, Target, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  totalReviews: number;
  averageScore: string;
  languageBreakdown: Record<string, number>;
  improvementTrend: number[];
  recentHistory: any[];
}

interface AnalyticsDashboardProps {
  sessionId: string;
}

export default function AnalyticsDashboard({ sessionId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'x-session-id': sessionId
        }
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <Code2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Start analyzing code to see your analytics!</p>
      </div>
    );
  }

  const mostUsedLanguage = Object.entries(analytics.languageBreakdown)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Your Analytics</h2>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Reviews</p>
              <p className="text-2xl font-bold text-blue-900">{analytics.totalReviews}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Average Score</p>
              <p className="text-2xl font-bold text-green-900">{analytics.averageScore}/10</p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Top Language</p>
              <p className="text-lg font-bold text-purple-900 capitalize">{mostUsedLanguage}</p>
            </div>
            <Code2 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Language Breakdown */}
      {Object.keys(analytics.languageBreakdown).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Language Usage</h3>
          <div className="space-y-2">
            {Object.entries(analytics.languageBreakdown).map(([language, count]) => (
              <div key={language} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">{language}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.totalReviews) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Trend */}
      {analytics.improvementTrend.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Score Trend</h3>
          <div className="flex items-end space-x-1 h-20">
            {analytics.improvementTrend.map((score, index) => (
              <div
                key={index}
                className="bg-indigo-600 rounded-t flex-1 min-w-0"
                style={{ height: `${(score / 10) * 100}%` }}
                title={`Score: ${score}`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      {analytics.recentHistory.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Recent Activity
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {analytics.recentHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium mr-2 capitalize">
                    {item.language}
                  </span>
                  <span className="text-gray-600 truncate max-w-xs">
                    {item.code.substring(0, 50)}...
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-medium">{item.score}/10</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
