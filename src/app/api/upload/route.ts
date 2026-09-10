import { NextResponse } from 'next/server';

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

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: "Server Configuration Error: Database endpoint is not configured." },
        { status: 500 }
      );
    }

    // Forward to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'uploadFile',
        fileName: data.fileName,
        fileData: data.base64Data
      }),
    });

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
      { success: false, error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}
