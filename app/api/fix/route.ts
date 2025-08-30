import { NextRequest, NextResponse } from 'next/server';
import { multiAI } from '../../../lib/multiAI';

function getLanguageSpecificGuidelines(language: string): string {
  const guidelines: Record<string, string> = {
    javascript: "Use const/let over var, avoid == (use ===), handle async/await properly, check for null/undefined",
    typescript: "Leverage type safety, use interfaces/types, avoid 'any', proper error handling with types", 
    python: "Follow PEP 8, use list comprehensions appropriately, handle exceptions properly, avoid global variables",
    java: "Follow naming conventions, use proper exception handling, avoid raw types, use StringBuilder for string concatenation",
    cpp: "Manage memory properly, use RAII, avoid raw pointers when possible, check for buffer overflows",
    csharp: "Use proper disposal patterns, leverage LINQ appropriately, follow C# naming conventions",
    go: "Handle errors explicitly, use goroutines safely, follow Go conventions, avoid memory leaks",
    rust: "Leverage ownership system, handle Results properly, use iterators efficiently",
    php: "Sanitize inputs, use prepared statements, follow PSR standards, handle errors properly",
    ruby: "Follow Ruby conventions, use blocks appropriately, handle exceptions properly"
  };
  
  return guidelines[language.toLowerCase()] || "Follow language best practices and conventions";
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, issues } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    const issuesText = issues && issues.length > 0 
      ? issues.map((issue: any) => `- ${issue.type}: ${issue.description}`).join('\n')
      : 'General code improvements';

    const prompt = `You are a world-class software engineer with expertise in ${language}. Your task is to fix the provided code based on identified issues while maintaining its core functionality.

CONTEXT:
Language: ${language}
Issues Found: ${issuesText}

ORIGINAL CODE:
\`\`\`${language}
${code}
\`\`\`

FIXING GUIDELINES (FOLLOW STRICTLY):

🔴 CRITICAL ISSUES (Fix Immediately):
- Syntax errors, runtime crashes
- Security vulnerabilities (SQL injection, XSS, etc.)
- Memory leaks, infinite loops
- Logic bugs that break functionality

🟡 HIGH PRIORITY ISSUES:
- Performance bottlenecks (O(n²) algorithms, unnecessary loops)
- Improper error handling
- Resource management issues
- Major code smells

🟢 MEDIUM/LOW PRIORITY:
- Code style inconsistencies
- Missing comments (only if code is complex)
- Variable naming improvements
- Minor optimizations

LANGUAGE-SPECIFIC BEST PRACTICES FOR ${language}:
${getLanguageSpecificGuidelines(language)}

STRICT RULES:
1. PRESERVE original functionality completely
2. Make MINIMAL changes - don't rewrite working code
3. Fix only issues that actually impact quality/security/performance
4. Don't add unnecessary complexity or features
5. Keep the same code structure unless it's fundamentally broken
6. Don't change variable names unless they're truly confusing

OUTPUT FORMAT (JSON ONLY):
{
  "fixed_code": "Complete corrected code with proper formatting",
  "changes_made": [
    "Specific description of each fix applied"
  ],
  "explanation": "Brief 2-3 sentence summary of improvements made",
  "fixes_applied": [
    {
      "issue_type": "Critical Bug|Security|Performance|Style|Best Practice",
      "severity": "Critical|High|Medium|Low", 
      "description": "What exactly was fixed and why",
      "before": "Code snippet before fix",
      "after": "Code snippet after fix"
    }
  ],
  "estimated_new_score": "Realistic 1-10 score after fixes (be conservative)",
  "unfixed_issues": [
    "Any issues that were intentionally left unfixed and why"
  ]
}

Remember: Good working code should score 7-8. Only perfect, production-ready code gets 9-10.`;

function getLanguageSpecificGuidelines(language: string): string {
  const guidelines: Record<string, string> = {
    javascript: "Use const/let over var, avoid == (use ===), handle async/await properly, check for null/undefined",
    typescript: "Leverage type safety, use interfaces/types, avoid 'any', proper error handling with types", 
    python: "Follow PEP 8, use list comprehensions appropriately, handle exceptions properly, avoid global variables",
    java: "Follow naming conventions, use proper exception handling, avoid raw types, use StringBuilder for string concatenation",
    cpp: "Manage memory properly, use RAII, avoid raw pointers when possible, check for buffer overflows",
    csharp: "Use proper disposal patterns, leverage LINQ appropriately, follow C# naming conventions",
    go: "Handle errors explicitly, use goroutines safely, follow Go conventions, avoid memory leaks",
    rust: "Leverage ownership system, handle Results properly, use iterators efficiently",
    php: "Sanitize inputs, use prepared statements, follow PSR standards, handle errors properly",
    ruby: "Follow Ruby conventions, use blocks appropriately, handle exceptions properly"
  };
  
  return guidelines[language.toLowerCase()] || "Follow language best practices and conventions";
}

    const aiResponse = await multiAI.complete(prompt, 'You are a senior software engineer. Provide clean, working code fixes in the requested JSON format.');

    const content = aiResponse.content;
    
    console.log(`AI Fix completed using: ${aiResponse.provider}`);
    
    let fixResult;
    try {
      const jsonString = content?.replace(/```json\n?/, '').replace(/```\n?$/, '').trim() || '{}';
      fixResult = JSON.parse(jsonString);
    } catch (parseError) {
      fixResult = {
        fixed_code: code,
        changes_made: ["Unable to parse AI response"],
        explanation: "The AI response couldn't be parsed. Original code returned."
      };
    }

    return NextResponse.json({ fixResult });

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
      { error: `Failed to fix code: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
