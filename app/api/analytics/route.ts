import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo (in production, use a database)
let codeHistory: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { code, language, review, action } = await request.json();
    
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      code: code.substring(0, 500), // Store first 500 chars
      language,
      score: review?.overall_score || 0,
      issuesCount: review?.issues?.length || 0,
      action, // 'analyze' or 'fix'
      sessionId: request.headers.get('x-session-id') || 'anonymous'
    };

    codeHistory.push(entry);
    
    // Keep only last 100 entries for demo
    if (codeHistory.length > 100) {
      codeHistory = codeHistory.slice(-100);
    }

    return NextResponse.json({ success: true, entryId: entry.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save history' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'anonymous';
    const userHistory = codeHistory.filter(entry => entry.sessionId === sessionId);
    
    // Generate analytics
    const analytics = {
      totalReviews: userHistory.length,
      averageScore: userHistory.length > 0 
        ? (userHistory.reduce((sum, entry) => sum + entry.score, 0) / userHistory.length).toFixed(1)
        : 0,
      languageBreakdown: userHistory.reduce((acc: any, entry) => {
        acc[entry.language] = (acc[entry.language] || 0) + 1;
        return acc;
      }, {}),
      improvementTrend: userHistory.slice(-10).map(entry => entry.score),
      recentHistory: userHistory.slice(-10).reverse()
    };

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
