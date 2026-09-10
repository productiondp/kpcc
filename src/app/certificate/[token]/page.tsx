'use client';

import React, { useEffect, useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CertificatePage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await fetch(`/api/certificate/${token}`);
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Certificate not found.');
        }
      } catch (err) {
        setError('Network error verifying certificate.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCert();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium tracking-widest uppercase text-sm">Verifying Secure Token...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Certificate</h2>
          <p className="text-gray-500 text-sm">{error || "This certificate token is invalid, expired, or has not been approved."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="mb-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="KPCC" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary tracking-widest uppercase">Official Membership Record</h1>
        <div className="mt-2 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
          <ShieldCheck size={14} />
          VERIFIED AUTHENTIC
        </div>
      </div>

      {/* Certificate Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl w-full border border-gray-200 mb-8">
        <div className="p-8 sm:p-12 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Membership Details</p>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{data.fullName}</h2>
          <p className="text-lg text-gray-600 mb-10">KPCC Industries Cell Member</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left border-t border-gray-100 pt-8">
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Membership ID No.</span>
              <span className="text-lg font-bold text-gray-900">{data.membershipIdNo}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Date of Admission</span>
              <span className="text-lg font-bold text-gray-900">{data.dateOfAdmission}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Application Reference</span>
              <span className="text-sm font-medium text-gray-500">{data.applicationNo}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-gray-50 p-6 sm:px-12 flex flex-col sm:flex-row gap-4 justify-center items-center border-t border-gray-200">
          <a 
            href={data.certificateUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Download size={18} />
            Download PDF Certificate
          </a>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center max-w-md">
        This is a secure electronic record. It does not require a physical signature for digital verification.
      </p>
    </div>
  );
}
