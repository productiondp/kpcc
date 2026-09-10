import { NextResponse } from 'next/server';

// Vercel Serverless Functions have a 4.5MB body limit. 
// We should enforce a safe margin.
const MAX_PAYLOAD_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: Request) {
  try {
    // 1. Check Content-Length before parsing (to avoid memory bloat)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { success: false, error: "Payload too large. Please reduce the size of uploaded images." },
        { status: 413 }
      );
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Malformed request. Invalid JSON payload." },
        { status: 400 }
      );
    }

    // Basic structural validation
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, error: "Malformed request. Payload must be an object." },
        { status: 400 }
      );
    }

    // 2. Configuration Check
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const isMockEnabled = process.env.MOCK_SUBMISSION === 'true';
    
    if (!scriptUrl) {
      if (isMockEnabled) {
        console.warn("GOOGLE_SCRIPT_URL is not set. MOCK_SUBMISSION is true. Simulating success.");
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        return NextResponse.json({ success: true, message: "Simulated success (Mock Mode)" });
      } else {
        console.error("CRITICAL: GOOGLE_SCRIPT_URL is not configured.");
        return NextResponse.json(
          { success: false, error: "Server Configuration Error: Database endpoint is not configured." },
          { status: 500 }
        );
      }
    }

    // 3. Forward to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json({ success: true, ...result });
    } else {
      return NextResponse.json({ success: false, error: result.message || "Unknown error from database" }, { status: 400 });
    }
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process application. Please try again later." },
      { status: 500 }
    );
  }
}
