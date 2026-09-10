import { NextResponse } from 'next/server';
import { getGoogleScriptUrl } from '@/lib/getGoogleScriptUrl';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data || !data.base64Data || !data.fileName) {
      return NextResponse.json(
        { success: false, error: "Missing file data or filename." },
        { status: 400 }
      );
    }

    let scriptUrl: string;
    try {
      scriptUrl = getGoogleScriptUrl();
    } catch (e: any) {
      console.error(e.message);
      return NextResponse.json(
        { success: false, error: "Server Configuration Error: Database endpoint is not correctly configured." },
        { status: 500 }
      );
    }
    
    // Server-side diagnostic log (never logs full URL)
    console.log(`[Upload] Sending request to Apps Script backend: ${new URL(scriptUrl).origin}${new URL(scriptUrl).pathname.substring(0, 15)}...`);

    // Forward to Google Apps Script using manual redirect handling
    // This is required to bypass Node 18's `fetch failed` bug on 302 POST redirects with large bodies
    let response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'uploadFile',
        fileName: data.fileName,
        fileData: data.base64Data
      }),
      redirect: 'manual'
    });

    // If Google Apps Script returns a 302 Found redirect to script.googleusercontent.com
    // We manually follow it with a GET request to retrieve the JSON output
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
      console.error("Failed to parse Apps Script upload response.");
      return NextResponse.json(
        { success: false, error: "Server Configuration Error: The backend returned an invalid response (likely an HTML login page). Please check Google Apps Script deployment permissions." },
        { status: 500 }
      );
    }

    if (result.status === 'success') {
      return NextResponse.json({ success: true, url: result.url });
    } else {
      return NextResponse.json({ success: false, error: result.message || "Unknown error during upload" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Upload error:", error.message || error);
    return NextResponse.json(
      { success: false, error: `Upload endpoint exception: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
