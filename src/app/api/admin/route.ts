import { NextResponse } from 'next/server';

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { success: false, error: "Server Configuration Error: GOOGLE_SCRIPT_URL is not set." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${scriptUrl}?action=getApplications`, {
      method: 'GET',
    });

    let result;
    try {
      const rawText = await response.text();
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse Apps Script response in Admin GET.");
      return NextResponse.json(
        { success: false, error: "Failed to parse Apps Script response. Check Deployment Permissions." },
        { status: 500 }
      );
    }

    if (result.status === 'success') {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin Fetch Error:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { success: false, error: "Server Configuration Error: GOOGLE_SCRIPT_URL is not set." },
      { status: 500 }
    );
  }

  try {
    const data = await request.json();
    
    // We expect { action: 'updateOfficeUse', applicationNo: '...', ...officeFields }
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      const rawText = await response.text();
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse Apps Script response in Admin POST.");
      return NextResponse.json(
        { success: false, error: "Failed to parse Apps Script response. Check Deployment Permissions." },
        { status: 500 }
      );
    }

    if (result.status === 'success') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin POST Error:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to update data." },
      { status: 500 }
    );
  }
}
