import { NextRequest, NextResponse } from 'next/server';
import { multiAI } from '../../../lib/multiAI';

function getLanguageSpecificChecks(language: string): string {
  const checks: Record<string, string> = {
    javascript: "Check for: var usage, == vs ===, async/await handling, null/undefined checks, prototype pollution",
    typescript: "Check for: any types, missing interfaces, type safety, error handling, generic usage",
    python: "Check for: PEP 8 compliance, exception handling, list comprehensions, global variables, imports",
    java: "Check for: exception handling, resource management, null checks, proper OOP usage, concurrency issues",
    cpp: "Check for: memory management, buffer overflows, null pointer dereference, RAII usage, const correctness",
    csharp: "Check for: disposal patterns, LINQ usage, exception handling, null reference exceptions, async patterns",
    go: "Check for: error handling, goroutine safety, channel usage, context usage, memory management",
    rust: "Check for: ownership patterns, error handling with Result, iterator usage, unsafe code blocks",
    php: "Check for: SQL injection, XSS vulnerabilities, input sanitization, proper error handling, PSR compliance",
    ruby: "Check for: Ruby conventions, block usage, exception handling, method visibility, class design"
  };
  
  return checks[language.toLowerCase()] || "Check for common issues and best practices for this language";
}

// Simple language detection function
function detectLanguage(code: string, selectedLanguage: string): string {
  const codeLines = code.toLowerCase().trim();
  const originalCode = code.trim(); // Keep original case for regex
  
  // Python detection (more comprehensive)
  if (codeLines.includes('def ') || 
      codeLines.includes('import ') || 
      codeLines.includes('from ') ||
      codeLines.includes('print(') || 
      codeLines.includes('if __name__') || 
      /^\s*#/m.test(originalCode) ||
      /:\s*$/m.test(originalCode) || // Python colon syntax
      /^\s*(for|while|if|elif|else|try|except|finally|with|class)\s+.*:\s*$/m.test(originalCode)) {
    return 'python';
  }
  
  // JavaScript/TypeScript detection
  if (codeLines.includes('function ') || 
      codeLines.includes('const ') || 
      codeLines.includes('let ') ||
      codeLines.includes('var ') || 
      codeLines.includes('=>') || 
      codeLines.includes('console.log') ||
      codeLines.includes('document.') ||
      /\{[\s\S]*\}/m.test(originalCode)) { // JS object/function syntax
    return 'javascript';
  }
  
  // Java detection
  if (codeLines.includes('public class ') || 
      codeLines.includes('public static void main') ||
      codeLines.includes('system.out.println') ||
      codeLines.includes('package ') ||
      /public\s+(class|interface|enum)/m.test(originalCode)) {
    return 'java';
  }
  
  // C++ detection
  if (codeLines.includes('#include') || 
      codeLines.includes('using namespace') ||
      codeLines.includes('std::') || 
      codeLines.includes('cout <<') ||
      codeLines.includes('cin >>')) {
    return 'cpp';
  }
  
  // C# detection
  if (codeLines.includes('using system') || 
      codeLines.includes('console.writeline') ||
      (codeLines.includes('public class') && codeLines.includes('namespace')) ||
      codeLines.includes('console.write')) {
    return 'csharp';
  }
  
  // Go detection
  if (codeLines.includes('package ') || codeLines.includes('func ') || codeLines.includes('fmt.')) {
    return 'go';
  }
  
  // PHP detection
  if (codeLines.includes('<?php') || codeLines.includes('echo ') || codeLines.includes('$')) {
    return 'php';
  }
  
  // Fallback to selected language
  return selectedLanguage;
}

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Detect actual language from code content
    const detectedLanguage = detectLanguage(code, language);
    const languageWarning = detectedLanguage !== language ? 
      `Note: You selected ${language} but the code appears to be ${detectedLanguage}. Analysis will use ${detectedLanguage}.` : 
      null;

    console.log('Language Detection Debug:', {
      selectedLanguage: language,
      detectedLanguage: detectedLanguage,
      languageWarning: languageWarning,
      codeSnippet: code.substring(0, 100)
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are a senior software engineer conducting a thorough code review. Analyze the ${detectedLanguage} code below with the expertise of a tech lead at a top company.

CODE TO REVIEW:
\`\`\`${detectedLanguage}
${code}
\`\`\`

ANALYSIS GUIDELINES:
🔍 Be realistic and fair in scoring:
- Score 8-9: Production-ready, well-structured code with minor improvements possible
- Score 6-7: Functional code with some issues but generally good
- Score 4-5: Works but has notable problems that should be addressed
- Score 1-3: Serious issues, bugs, or security vulnerabilities

📊 Focus Areas (prioritize in this order):
1. CRITICAL: Syntax errors, logic bugs, security vulnerabilities
2. HIGH: Performance issues, improper error handling, resource leaks
3. MEDIUM: Code organization, maintainability, best practices
4. LOW: Style consistency, naming conventions, comments

🎯 ${detectedLanguage.toUpperCase()} SPECIFIC CHECKS:
${getLanguageSpecificChecks(detectedLanguage)}

REQUIRED JSON OUTPUT:
{
  "overall_score": number (1-10, be realistic - functional code with minor issues should score 6-7),
  "detected_language": "${detectedLanguage}",
  "language_warning": ${languageWarning ? `"${languageWarning}"` : 'null'},
  "issues": [
    {
      "type": "Critical Bug|Security|Performance|Logic Error|Best Practice|Style|Maintainability",
      "severity": "Critical|High|Medium|Low",
      "description": "Clear, specific description of the issue",
      "line": number (if applicable),
      "priority": number (1-5, where 1=must fix immediately),
      "suggestion": "Specific recommendation for fixing this issue"
    }
  ],
  "suggestions": [
    "Actionable improvement recommendations ranked by importance"
  ],
  "summary": "2-3 sentence summary of code quality and main findings",
  "strengths": [
    "Specific positive aspects of the code"
  ],
  "security_notes": [
    "Any security considerations or vulnerabilities found"
  ],
  "performance_notes": [
    "Performance observations and potential optimizations"
  ]
}

IMPORTANT: Be constructive and specific. Avoid generic feedback. Point out real issues that matter.`;

function getLanguageSpecificChecks(language: string): string {
  const checks: Record<string, string> = {
    javascript: "Check for: var usage, == vs ===, async/await handling, null/undefined checks, prototype pollution",
    typescript: "Check for: any types, missing interfaces, type safety, error handling, generic usage",
    python: "Check for: PEP 8 compliance, exception handling, list comprehensions, global variables, imports",
    java: "Check for: exception handling, resource management, null checks, proper OOP usage, concurrency issues",
    cpp: "Check for: memory management, buffer overflows, null pointer dereference, RAII usage, const correctness",
    csharp: "Check for: disposal patterns, LINQ usage, exception handling, null reference exceptions, async patterns",
    go: "Check for: error handling, goroutine safety, channel usage, context usage, memory management",
    rust: "Check for: ownership patterns, error handling with Result, iterator usage, unsafe code blocks",
    php: "Check for: SQL injection, XSS vulnerabilities, input sanitization, proper error handling, PSR compliance",
    ruby: "Check for: Ruby conventions, block usage, exception handling, method visibility, class design"
  };
  
  return checks[language.toLowerCase()] || "Check for common issues and best practices for this language";
}

    const aiResponse = await multiAI.complete(prompt, 'You are a senior software engineer and code reviewer. Provide thorough, constructive feedback in the requested JSON format.');

    const content = aiResponse.content;
    
    console.log(`AI Analysis completed using: ${aiResponse.provider}`);
    
    // Try to parse JSON from the response
    let review;
    try {
      // Remove any markdown code block formatting
      const jsonString = content?.replace(/```json\n?/, '').replace(/```\n?$/, '').trim() || '{}';
      review = JSON.parse(jsonString);
    } catch (parseError) {
      // Fallback: create a structured response from the raw text
      review = {
        overall_score: 7,
        issues: [
          {
            type: "Analysis",
            severity: "Medium",
            description: "AI response couldn't be parsed as JSON. Raw analysis: " + (content?.substring(0, 200) || '') + "..."
          }
        ],
        suggestions: ["Review the AI response format"],
        summary: (content?.substring(0, 300) || '') + "..."
      };
    }

    // Add language detection results to the review
    review.detected_language = detectedLanguage;
    review.language_warning = languageWarning;

    return NextResponse.json({ review });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    console.error('Error details:', {
      code: error.code,
      type: error.type,
      status: error.status,
      message: error.message
    });
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'API quota exceeded. Please check your OpenAI billing.' },
        { status: 429 }
      );
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key.' },
        { status: 401 }
      );
    }

    if (error.code === 'model_not_found') {
      return NextResponse.json(
        { error: 'The AI model is not available. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Failed to analyze code: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}