'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { createRoot } from 'react-dom/client';
import ApplicationPDF from '@/components/ApplicationPDF';

// PIN for simple access control. This should be replaced with robust auth (NextAuth) later.
const ADMIN_PIN = 'KPCC2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Office Use Form State
  const [officeForm, setOfficeForm] = useState({
    membershipIdNo: '',
    dateOfAdmission: '',
    verifiedBy: '',
    approvedBy: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      fetchApplications();
    } else {
      setPinError('Invalid PIN');
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || []);
      } else {
        alert("Error fetching data: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApp = (app: any) => {
    setSelectedApp(app);
    setOfficeForm({
      membershipIdNo: app['Membership ID No'] || '',
      dateOfAdmission: app['Date of Admission'] || '',
      verifiedBy: app['Verified By'] || '',
      approvedBy: app['Approved By'] || ''
    });
    setUpdateMessage('');
  };

  const handleUpdateOfficeUse = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMessage('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateOfficeUse',
          applicationNo: selectedApp['Application Form No.'],
          ...officeForm
        })
      });

      const data = await res.json();
      if (data.success) {
        setUpdateMessage('Successfully updated!');
        // Update local state
        setApplications(applications.map(a => 
          a['Application Form No.'] === selectedApp['Application Form No.']
            ? { ...a, 'Membership ID No': officeForm.membershipIdNo, 'Date of Admission': officeForm.dateOfAdmission, 'Verified By': officeForm.verifiedBy, 'Approved By': officeForm.approvedBy }
            : a
        ));
      } else {
        setUpdateMessage('Error: ' + data.error);
      }
    } catch (err) {
      setUpdateMessage('Network error failed to update.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadOfficialPDF = async () => {
    if (!selectedApp) return;

    // Dynamically import html2pdf to prevent SSR 'self is not defined' errors
    const html2pdf = (await import('html2pdf.js')).default;

    // We map the spreadsheet keys back to the expected FormData keys for ApplicationPDF
    const formData = {
      fullName: selectedApp['Full Name'],
      dob: selectedApp['Date of Birth'],
      age: selectedApp['Age'],
      gender: selectedApp['Gender'],
      parentsName: selectedApp["Father's / Mother's Name"],
      residentialAddress: selectedApp['Residential Address'],
      district: selectedApp['District / Assembly'],
      pinCode: selectedApp['Pin Code'],
      mobile: selectedApp['Mobile'],
      whatsapp: selectedApp['WhatsApp'],
      email: selectedApp['Email ID'],
      bloodGroup: selectedApp['Blood Group'],
      idProofType: selectedApp['ID Proof Type'],
      idProofNo: selectedApp['ID Proof No'],
      education: selectedApp['Educational Qualification'],
      designation: selectedApp['Designation'],
      organization: selectedApp['Organization'],
      sector: selectedApp['Sector / Industry'],
      officeAddress: selectedApp['Office Address'],
      officePinCode: selectedApp['Office Pin Code'],
      officeContact: selectedApp['Office Contact'],
      officeEmail: selectedApp['Office Email'],
      gstStatus: selectedApp['GST Status'],
      gstType: selectedApp['GST Type'],
      isIncMember: selectedApp['INC Member'],
      pastRoles: selectedApp['Past Roles'],
      tradeAssoc: selectedApp['Trade Associations'],
      socialOrgs: selectedApp['Social Organizations'],
      feeAmount: selectedApp['Fee Amount'],
      paymentMode: selectedApp['Payment Mode'],
      paymentDate: selectedApp['Payment Date'],
      transactionRef: selectedApp['Transaction Ref'],
      declarationDate: selectedApp['Declaration Date'],
      declarationPlace: selectedApp['Declaration Place'],
      signatureName: selectedApp['Signature Name'],
      photoData: selectedApp['Photo Base64'],
      // Office use mapped from state to ensure latest values printed
      membershipIdNo: officeForm.membershipIdNo,
      dateOfAdmission: officeForm.dateOfAdmission,
      verifiedBy: officeForm.verifiedBy,
      approvedBy: officeForm.approvedBy
    };

    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    const root = createRoot(element);
    
    // Crucial: pass isAdmin={true} so Section 6 renders
    root.render(<ApplicationPDF data={formData as any} applicationNo={selectedApp['Application Form No.']} isAdmin={true} />);

    setTimeout(() => {
      const opt = {
        margin:       10,
        filename:     `${selectedApp['Application Form No.'] || 'Official_Application'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };
      
      html2pdf().set(opt).from(element).save().then(() => {
        setTimeout(() => {
          root.unmount();
          document.body.removeChild(element);
        }, 1000);
      });
    }, 1500);
  };

  const filteredApps = applications.filter(app => {
    const term = search.toLowerCase();
    const appNo = (app['Application Form No.'] || '').toLowerCase();
    const name = (app['Full Name'] || '').toLowerCase();
    const org = (app['Organization'] || '').toLowerCase();
    return appNo.includes(term) || name.includes(term) || org.includes(term);
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="KPCC Logo" className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-xl font-bold text-primary mb-2">Office Administration</h1>
          <p className="text-sm text-gray-500 mb-8">Enter secure PIN to access official records.</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-xl tracking-[0.5em] mb-4"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="••••••••"
            />
            {pinError && <p className="text-red-500 text-sm mb-4">{pinError}</p>}
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
              Access Records
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="KPCC" className="w-8 h-8" />
          <h2 className="font-bold text-primary">Office Admin</h2>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <input 
            type="text" 
            placeholder="Search Name, ID, Org..." 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={fetchApplications} className="mt-2 w-full text-xs text-gray-500 hover:text-primary flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh List
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading applications...</div>
          ) : filteredApps.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No applications found.</div>
          ) : (
            filteredApps.map((app, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSelectApp(app)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors ${selectedApp && selectedApp['Application Form No.'] === app['Application Form No.'] ? 'bg-orange-50 border-l-4 border-l-primary' : ''}`}
              >
                <div className="text-xs font-bold text-primary mb-1">{app['Application Form No.'] || 'Pending ID'}</div>
                <div className="font-semibold text-gray-800">{app['Full Name'] || 'Unknown'}</div>
                <div className="text-xs text-gray-500 truncate">{app['Organization'] || '-'}</div>
                {app['Membership ID No'] && (
                  <div className="mt-2 inline-block bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Processed</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-screen overflow-y-auto bg-gray-50 p-6 md:p-12">
        <AnimatePresence mode="wait">
          {!selectedApp ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center text-gray-400">
              Select an application to view and manage Office Use details.
            </motion.div>
          ) : (
            <motion.div key={selectedApp['Application Form No.']} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedApp['Full Name']}</h1>
                  <p className="text-primary font-medium">{selectedApp['Application Form No.']}</p>
                </div>
                <button onClick={handleDownloadOfficialPDF} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Download Official PDF
                </button>
              </div>

              {/* Applicant Info Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Mobile</span>
                  <span className="font-medium text-gray-900">{selectedApp['Mobile']}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">District</span>
                  <span className="font-medium text-gray-900">{selectedApp['District / Assembly']}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Organization</span>
                  <span className="font-medium text-gray-900">{selectedApp['Organization']}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Submitted On</span>
                  <span className="font-medium text-gray-900">{selectedApp['Timestamp'] ? new Date(selectedApp['Timestamp']).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              {/* Office Use Update Form */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">For Office Use Only</h2>
                
                <form onSubmit={handleUpdateOfficeUse} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Membership ID No.</label>
                      <input 
                        type="text" 
                        value={officeForm.membershipIdNo}
                        onChange={e => setOfficeForm({...officeForm, membershipIdNo: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Admission</label>
                      <input 
                        type="date" 
                        value={officeForm.dateOfAdmission}
                        onChange={e => setOfficeForm({...officeForm, dateOfAdmission: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Verified By (Name & Sign)</label>
                      <input 
                        type="text" 
                        value={officeForm.verifiedBy}
                        onChange={e => setOfficeForm({...officeForm, verifiedBy: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                        placeholder="Name of Verifier"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Approved By (Name & Sign)</label>
                      <input 
                        type="text" 
                        value={officeForm.approvedBy}
                        onChange={e => setOfficeForm({...officeForm, approvedBy: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                        placeholder="Name of Approver"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button 
                      type="submit" 
                      disabled={updating}
                      className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Office Records'}
                    </button>
                    {updateMessage && (
                      <span className={`text-sm font-medium ${updateMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                        {updateMessage}
                      </span>
                    )}
                  </div>
                </form>

              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
