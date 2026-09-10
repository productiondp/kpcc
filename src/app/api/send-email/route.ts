import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, fullName, applicationNo, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ success: false, message: 'Missing email or token' }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.log(`[SMTP Not Configured] Would send certificate email to: ${email}`);
      console.log(`Certificate Link: https://kpcc-blond.vercel.app/certificate/${token}`);
      return NextResponse.json({ 
        success: false, 
        message: 'SMTP credentials missing. Email delivery skipped but approval succeeded.' 
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587', 10),
      secure: parseInt(SMTP_PORT || '587', 10) === 465, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const certificateUrl = `https://kpcc-blond.vercel.app/certificate/${token}`;

    const mailOptions = {
      from: `"KPCC Industries Cell" <${SMTP_USER}>`,
      to: email,
      subject: `Membership Approved - KPCC Industries Cell [${applicationNo}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
          <h2 style="color: #ff6b00; border-bottom: 2px solid #ff6b00; padding-bottom: 8px;">Application Approved</h2>
          <p>Dear <strong>${fullName}</strong>,</p>
          <p>We are pleased to inform you that your membership application (<strong>${applicationNo}</strong>) for the KPCC Industries Cell has been formally approved.</p>
          
          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px; margin: 24px 0; text-align: center;">
            <p style="margin-bottom: 16px;">You can view and download your official Membership Certificate using the secure link below:</p>
            <a href="${certificateUrl}" style="display: inline-block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">View Membership Certificate</a>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
            This is an automated message. Please do not reply directly to this email.<br>
            KPCC Industries Cell, Indira Bhavan, Thiruvananthapuram.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error("Nodemailer error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
