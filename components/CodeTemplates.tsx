'use client';

import React, { useState } from 'react';
import { Code, BookOpen, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { codeTemplates } from '../lib/codeTemplates';

interface CodeTemplatesProps {
  onSelectTemplate: (code: string, language: string) => void;
}

export default function CodeTemplates({ onSelectTemplate }: CodeTemplatesProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null);

  const handleTemplateClick = (template: any) => {
    onSelectTemplate(template.code, selectedLanguage);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Code Templates</h2>
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {Object.keys(codeTemplates).map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Templates List */}
      <div className="space-y-3">
        {(codeTemplates as any)[selectedLanguage]?.map((template: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedTemplate(expandedTemplate === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{template.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateClick(template);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Use
                  </button>
                  {expandedTemplate === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedTemplate === index && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Code Preview:</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {template.code}
                  </pre>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Issues:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {template.expectedIssues.map((issue: string, issueIndex: number) => (
                      <li key={issueIndex}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <Code className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Pro Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              These templates contain common coding issues. Use them to test the AI reviewer's ability to detect and fix problems!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
