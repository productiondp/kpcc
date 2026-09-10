import { NextResponse } from 'next/server';
import { getGoogleScriptUrl } from '@/lib/getGoogleScriptUrl';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.applicationNo || !data.membershipIdNo || !data.dateOfAdmission || !data.verifiedBy || !data.approvedBy || !data.certificateBase64) {
      return NextResponse.json(
        { success: false, error: 'Missing required approval fields or certificate data.' },
        { status: 400 }
      );
    }

    // 1. Configuration Check
    const isMockEnabled = process.env.MOCK_SUBMISSION === 'true';
    let scriptUrl: string;
    try {
      scriptUrl = getGoogleScriptUrl();
    } catch (e: any) {
      if (isMockEnabled) {
        return NextResponse.json({ success: true, message: "Simulated approval (Mock Mode)" });
      }
      return NextResponse.json(
        { success: false, error: "Database endpoint is not correctly configured." },
        { status: 500 }
      );
    }

    // 2. Generate Secure Token
    const secureToken = crypto.randomBytes(32).toString('hex');
    const fileName = `Certificate_${data.applicationNo}_${Date.now()}`;

    // 3. Upload Certificate PDF to Drive
    let uploadResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'uploadFile',
        fileName: fileName,
        fileData: data.certificateBase64
      }),
      redirect: 'manual'
    });

    if (uploadResponse.status === 302 || uploadResponse.status === 303) {
      const location = uploadResponse.headers.get('location');
      if (location) {
        uploadResponse = await fetch(location, { method: 'GET' });
      }
    }

    const uploadResult = await uploadResponse.json();
    if (!uploadResult.success && uploadResult.status !== 'success') {
       throw new Error(`Failed to upload certificate: ${uploadResult.message || uploadResult.error}`);
    }
    
    const certificateUrl = uploadResult.url;

    // 4. Send Approval Command to Google Apps Script
    let approveResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approveApplication',
        applicationNo: data.applicationNo,
        certificateUrl: certificateUrl,
        certificateToken: secureToken,
        emailSent: true // Will attempt to send email below
      }),
      redirect: 'manual'
    });

    if (approveResponse.status === 302 || approveResponse.status === 303) {
      const location = approveResponse.headers.get('location');
      if (location) {
        approveResponse = await fetch(location, { method: 'GET' });
      }
    }

    const approveResult = await approveResponse.json();
    if (!approveResult.success && approveResult.status !== 'success') {
       throw new Error(`Failed to update application status: ${approveResult.message}`);
    }

    // 5. Send Email
    let emailSent = false;
    let emailMessage = 'Not Configured';
    try {
      const emailRes = await fetch(new URL('/api/send-email', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          fullName: data.fullName,
          applicationNo: data.applicationNo,
          token: secureToken
        })
      });
      const emailResult = await emailRes.json();
      if (emailResult.success) {
        emailSent = true;
        emailMessage = 'Email sent successfully';
      } else {
        emailMessage = emailResult.message || 'Email sending failed';
      }
    } catch (err: any) {
      console.error("Email API failed:", err);
      emailMessage = "Failed to contact email API";
    }

    return NextResponse.json({
      success: true,
      token: secureToken,
      certificateUrl: certificateUrl,
      emailSent: emailSent,
      emailMessage: emailMessage,
      whatsappStatus: 'Not Configured'
    });

  } catch (error: any) {
    console.error("Approval error:", error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process approval." },
      { status: 500 }
    );
  }
}
