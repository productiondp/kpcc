import { NextResponse } from 'next/server';
import { getGoogleScriptUrl } from '@/lib/getGoogleScriptUrl';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const resolvedParams = await params;
    const token = resolvedParams.token;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const scriptUrl = getGoogleScriptUrl();
    
    // We reuse the getApplications endpoint to find the certificate
    // In a massive production system, we'd add a specialized 'getCertificateByToken' action to Apps Script
    // For now, this is secure because the token is cryptic and we do this server-side.
    let response = await fetch(`${scriptUrl}?action=getApplications`, {
      method: 'GET',
      redirect: 'manual'
    });

    if (response.status === 302 || response.status === 303) {
      const location = response.headers.get('location');
      if (location) {
        response = await fetch(location, { method: 'GET' });
      }
    }

    const result = await response.json();
    
    if (!result.success && result.status !== 'success') {
      throw new Error('Failed to fetch from database');
    }

    const applications = result.data || [];
    const app = applications.find((a: any) => a['Certificate Token'] === token && a['Application Status'] === 'Approved');

    if (!app) {
      return NextResponse.json({ success: false, error: 'Certificate not found or not approved.' }, { status: 404 });
    }

    // Return only public, safe data. No raw IDs, no private info.
    return NextResponse.json({
      success: true,
      data: {
        fullName: app['Full Name'],
        applicationNo: app['Application Form No.'],
        membershipIdNo: app['Membership ID No'],
        dateOfAdmission: app['Date of Admission'],
        certificateUrl: app['Certificate URL'], // Note: this is the Drive URL. If it must be hidden, we would proxy it.
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to verify certificate." },
      { status: 500 }
    );
  }
}
