import React from 'react';

interface CertificatePDFProps {
  fullName: string;
  membershipIdNo: string;
  dateOfAdmission: string;
  applicationNo: string;
}

export default function CertificatePDF({ fullName, membershipIdNo, dateOfAdmission, applicationNo }: CertificatePDFProps) {
  return (
    <div className="w-[800px] h-[600px] bg-white p-12 text-black font-sans mx-auto relative border-[12px] border-double border-primary">
      
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Watermark" className="w-96 h-96 object-contain" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="KPCC Logo" className="w-24 h-24 object-contain mb-4" />
          <h1 className="text-3xl font-bold text-primary uppercase tracking-widest">KPCC Industries Cell</h1>
          <p className="text-xs tracking-widest text-gray-500 uppercase mt-2">Kerala Pradesh Congress Committee</p>
        </div>

        {/* Title */}
        <div className="text-center mt-8">
          <h2 className="text-4xl font-serif font-bold text-gray-800 uppercase tracking-widest border-y-2 border-gray-200 py-4 inline-block px-12">
            Membership Certificate
          </h2>
        </div>

        {/* Content */}
        <div className="text-center mt-10 px-12 space-y-6">
          <p className="text-lg italic text-gray-600">This is to certify that</p>
          <h3 className="text-3xl font-bold text-primary border-b border-gray-300 pb-2 inline-block min-w-[300px]">
            {fullName}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            is a registered member of the KPCC Industries Cell.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-8 mt-12 px-12 text-sm text-gray-700 font-medium">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-xs uppercase text-gray-400 mb-1">Membership ID</span>
            <span className="text-lg font-bold">{membershipIdNo || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-xs uppercase text-gray-400 mb-1">Date of Admission</span>
            <span className="text-lg font-bold">{dateOfAdmission || 'N/A'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-auto px-12">
          <div className="text-xs text-gray-400">
            Application Ref: {applicationNo}
          </div>
          <div className="text-center w-48">
            <div className="border-b border-gray-800 h-16 mb-2"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Authorized Signatory</span>
          </div>
        </div>

      </div>

      {/* Official Approval Required Banner */}
      <div className="absolute bottom-2 left-0 w-full text-center">
        <span className="bg-red-100 text-red-600 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded border border-red-200">
          Draft Template - Requires Official Design & Legal Approval Before Issuance
        </span>
      </div>

    </div>
  );
}
