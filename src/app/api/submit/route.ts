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
    // We use manual redirect to bypass Node 18 `fetch failed` bugs on 302 POST redirects
    let response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      redirect: 'manual'
    });

    if (response.status === 302 || response.status === 303) {
      const location = response.headers.get('location');
      if (location) {
        response = await fetch(location, { method: 'GET' });
      }
    }

    let result;
    try {
      const rawText = await response.text();
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse Apps Script response. This usually means the Web App is returning an HTML login page due to incorrect deployment permissions. Access must be 'Anyone'.");
      return NextResponse.json(
        { success: false, error: "Server Configuration Error: The backend returned an invalid response (likely an HTML login page). Please check Google Apps Script deployment permissions." },
        { status: 500 }
      );
    }

    if (result.status === 'success') {
      return NextResponse.json({ success: true, ...result });
    } else {
      return NextResponse.json({ success: false, error: result.message || "Unknown error from database" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Submission error:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to process application. Please try again later." },
      { status: 500 }
    );
  }
}
