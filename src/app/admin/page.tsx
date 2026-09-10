'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import ApplicationPDF from '@/components/ApplicationPDF';
import CertificatePDF from '@/components/CertificatePDF';
import { Download, CheckCircle, FileText, ImageIcon, ShieldCheck, Check } from 'lucide-react';

const ADMIN_PIN = 'KPCC2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const [approving, setApproving] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [approveMessage, setApproveMessage] = useState('');

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
    setApproveMessage('');
    setShowApproveConfirm(false);
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

  const handleApproveApplication = async () => {
    if (!officeForm.membershipIdNo || !officeForm.dateOfAdmission || !officeForm.verifiedBy || !officeForm.approvedBy) {
      setApproveMessage('Error: All Office Use fields must be filled before approval.');
      setShowApproveConfirm(false);
      return;
    }

    setApproving(true);
    setApproveMessage('Generating certificate...');

    try {
      // 1. Generate PDF as base64
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      document.body.appendChild(element);

      const root = createRoot(element);
      root.render(
        <CertificatePDF 
          fullName={selectedApp['Full Name']}
          membershipIdNo={officeForm.membershipIdNo}
          dateOfAdmission={officeForm.dateOfAdmission}
          applicationNo={selectedApp['Application Form No.']}
        />
      );

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 1000));

      const opt = {
        margin: 0,
        filename: `certificate.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const }
      };

      const pdfBase64 = await html2pdf().set(opt).from(element).output('datauristring');
      
      root.unmount();
      document.body.removeChild(element);

      setApproveMessage('Uploading and sending email...');

      // 2. Call Approval API
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationNo: selectedApp['Application Form No.'],
          email: selectedApp['Email ID'],
          fullName: selectedApp['Full Name'],
          ...officeForm,
          certificateBase64: pdfBase64
        })
      });

      const data = await res.json();
      if (data.success) {
        setApproveMessage(`Approved successfully. ${data.emailMessage}`);
        
        // Update local state
        const updatedApp = { 
          ...selectedApp, 
          'Application Status': 'Approved', 
          'Certificate URL': data.certificateUrl,
          'Certificate Token': data.token
        };
        setSelectedApp(updatedApp);
        setApplications(applications.map(a => 
          a['Application Form No.'] === selectedApp['Application Form No.'] ? updatedApp : a
        ));
      } else {
        setApproveMessage('Error: ' + data.error);
      }

    } catch (err: any) {
      console.error(err);
      setApproveMessage('Error processing approval: ' + err.message);
    } finally {
      setApproving(false);
      setShowApproveConfirm(false);
    }
  };

  const handleDownloadOfficialPDF = async () => {
    if (!selectedApp) return;

    const html2pdf = (await import('html2pdf.js')).default;

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
      photoData: selectedApp['Photo Base64'], // Original payload data if available
      photoUrl: selectedApp['Passport Size Photo'], // Display uploaded URL
      idProofUrl: selectedApp['ID Proof Copy'],
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
    root.render(<ApplicationPDF data={formData as any} applicationNo={selectedApp['Application Form No.']} isAdmin={true} />);

    setTimeout(() => {
      const opt = {
        margin:       10,
        filename:     `${selectedApp['Application Form No.'] || 'Official_Application'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
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
    const matchesSearch = appNo.includes(term) || name.includes(term) || org.includes(term);
    
    const status = app['Application Status'] || 'Submitted';
    const matchesStatus = filterStatus === 'All' || status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalApps = applications.length;
  const submittedApps = applications.filter(a => (a['Application Status'] || 'Submitted') === 'Submitted').length;
  const approvedApps = applications.filter(a => a['Application Status'] === 'Approved').length;

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
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="KPCC" className="w-8 h-8" />
            <h2 className="font-bold text-primary">Office Admin</h2>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white border border-gray-200 rounded p-2 shadow-sm">
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-bold text-gray-800">{totalApps}</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded p-2 shadow-sm">
              <div className="text-xs text-orange-600">Pending</div>
              <div className="font-bold text-orange-700">{submittedApps}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-2 shadow-sm">
              <div className="text-xs text-green-600">Approved</div>
              <div className="font-bold text-green-700">{approvedApps}</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-200 space-y-3">
          <input 
            type="text" 
            placeholder="Search Name, ID, Org..." 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-primary"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-primary bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted (Pending)</option>
            <option value="Approved">Approved</option>
          </select>

          <button onClick={fetchApplications} className="w-full text-xs text-gray-500 hover:text-primary flex items-center justify-center gap-1 py-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh List
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : filteredApps.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No applications found.</div>
          ) : (
            filteredApps.map((app, idx) => {
              const isApproved = app['Application Status'] === 'Approved';
              return (
                <div 
                  key={idx} 
                  onClick={() => handleSelectApp(app)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors ${selectedApp && selectedApp['Application Form No.'] === app['Application Form No.'] ? 'bg-orange-50 border-l-4 border-l-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs font-bold text-primary">{app['Application Form No.'] || 'Pending ID'}</div>
                    {isApproved ? (
                      <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle size={10} /> Approved</span>
                    ) : (
                      <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Pending</span>
                    )}
                  </div>
                  <div className="font-semibold text-gray-800">{app['Full Name'] || 'Unknown'}</div>
                  <div className="text-xs text-gray-500 truncate">{app['Organization'] || '-'}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-screen overflow-y-auto bg-gray-50 p-6 md:p-12 relative">
        <AnimatePresence mode="wait">
          {!selectedApp ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center text-gray-400">
              Select an application to view and manage.
            </motion.div>
          ) : (
            <motion.div key={selectedApp['Application Form No.']} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6 pb-20">
              
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    {selectedApp['Full Name']}
                    {selectedApp['Application Status'] === 'Approved' && (
                      <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                        <ShieldCheck size={16} /> Approved
                      </span>
                    )}
                  </h1>
                  <p className="text-primary font-medium">{selectedApp['Application Form No.']}</p>
                </div>
                
                <div className="flex gap-3">
                  {selectedApp['Certificate Token'] && (
                    <a 
                      href={`/certificate/${selectedApp['Certificate Token']}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/20 flex items-center gap-2"
                    >
                      <FileText size={16} /> View Certificate
                    </a>
                  )}
                  <button onClick={handleDownloadOfficialPDF} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 flex items-center gap-2">
                    <Download size={16} /> Official PDF
                  </button>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ImageIcon size={16} /> Passport Photo</h3>
                  {selectedApp['Passport Size Photo'] ? (
                    <a href={selectedApp['Passport Size Photo']} target="_blank" rel="noreferrer" className="block w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden hover:opacity-90 transition-opacity">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedApp['Passport Size Photo']} alt="Photo" className="w-full h-full object-cover" />
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No photo uploaded</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><FileText size={16} /> ID Proof ({selectedApp['ID Proof Type'] || 'Unknown'})</h3>
                  {selectedApp['ID Proof Copy'] ? (
                    <a href={selectedApp['ID Proof Copy']} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                      <Download size={18} /> View / Download ID Proof
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No ID proof uploaded</p>
                  )}
                  {selectedApp['ID Proof No'] && <p className="text-sm text-gray-600 mt-2 font-mono">ID: {selectedApp['ID Proof No']}</p>}
                </div>
              </div>

              {/* Applicant Info Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Mobile</span>
                  <span className="font-medium text-gray-900">{selectedApp['Mobile']}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Email</span>
                  <span className="font-medium text-gray-900">{selectedApp['Email ID'] || '-'}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">District</span>
                  <span className="font-medium text-gray-900">{selectedApp['District / Assembly']}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Organization</span>
                  <span className="font-medium text-gray-900">{selectedApp['Organization']}</span>
                </div>
              </div>

              {/* Office Use Update Form */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">For Office Use Only</h2>
                
                <form onSubmit={handleUpdateOfficeUse} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Membership ID No. *</label>
                      <input 
                        type="text" 
                        value={officeForm.membershipIdNo}
                        onChange={e => setOfficeForm({...officeForm, membershipIdNo: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                        disabled={selectedApp['Application Status'] === 'Approved'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Admission *</label>
                      <input 
                        type="date" 
                        value={officeForm.dateOfAdmission}
                        onChange={e => setOfficeForm({...officeForm, dateOfAdmission: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                        disabled={selectedApp['Application Status'] === 'Approved'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Verified By (Name & Sign) *</label>
                      <input 
                        type="text" 
                        value={officeForm.verifiedBy}
                        onChange={e => setOfficeForm({...officeForm, verifiedBy: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                        placeholder="Name of Verifier"
                        required
                        disabled={selectedApp['Application Status'] === 'Approved'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Approved By (Name & Sign) *</label>
                      <input 
                        type="text" 
                        value={officeForm.approvedBy}
                        onChange={e => setOfficeForm({...officeForm, approvedBy: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                        placeholder="Name of Approver"
                        required
                        disabled={selectedApp['Application Status'] === 'Approved'}
                      />
                    </div>
                  </div>

                  {selectedApp['Application Status'] !== 'Approved' && (
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <button 
                        type="submit" 
                        disabled={updating}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 disabled:opacity-50"
                      >
                        {updating ? 'Saving...' : 'Save Office Records'}
                      </button>
                      {updateMessage && (
                        <span className={`text-sm font-medium ${updateMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                          {updateMessage}
                        </span>
                      )}
                    </div>
                  )}
                </form>

              </div>

              {/* Approval Workflow section */}
              {selectedApp['Application Status'] !== 'Approved' ? (
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Finalize & Approve</h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
                    Approving this application will generate a secure Membership Certificate, upload it to Drive, and email the applicant their secure verification link.
                  </p>
                  
                  {!showApproveConfirm ? (
                    <button 
                      onClick={() => setShowApproveConfirm(true)}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                    >
                      <CheckCircle size={20} /> Approve Application
                    </button>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                      <p className="font-bold text-gray-800 mb-4">Are you sure you want to approve this application and issue the membership certificate?</p>
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={() => setShowApproveConfirm(false)}
                          disabled={approving}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded font-semibold hover:bg-gray-200 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleApproveApplication}
                          disabled={approving}
                          className="px-6 py-2 bg-green-600 text-white rounded font-bold shadow hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {approving ? (
                            <>Processing <span className="animate-pulse">...</span></>
                          ) : (
                            <>Confirm Approval</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {approveMessage && (
                    <div className={`mt-4 text-sm font-bold ${approveMessage.includes('Error') ? 'text-red-600 bg-red-50 p-3 rounded' : 'text-green-700 bg-green-50 p-3 rounded'}`}>
                      {approveMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Application Approved</h3>
                  <p className="text-sm text-gray-600">The membership certificate has been generated and issued.</p>
                  <p className="text-xs text-gray-500 mt-2 font-mono break-all">
                    Certificate Token: {selectedApp['Certificate Token']}
                  </p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
