import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '@/lib/types';
import { FileText } from 'lucide-react';

export default function ReviewStep() {
  const { getValues } = useFormContext<FormData>();
  const data = getValues();

  const FieldValue = ({ label, value }: { label: string, value: string | undefined }) => (
    <div className="mb-4">
      <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">{label}</p>
      <p className="text-foreground font-medium text-sm">{value || <span className="text-gray-300 italic">Not provided</span>}</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <FileText size={24} className="text-accent" /> Review Your Application
        </h2>
        <p className="text-sm text-foreground/60">
          Please review all the information below. You can go back to edit any section before final submission.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-8">
        
        {/* Section 1: Personal */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">1. Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldValue label="Full Name" value={data.fullName} />
            <div className="grid grid-cols-3 gap-2">
              <FieldValue label="DOB" value={data.dob} />
              <FieldValue label="Age" value={data.age} />
              <FieldValue label="Gender" value={data.gender} />
            </div>
            <FieldValue label="Father's / Mother's Name" value={data.parentsName} />
            <FieldValue label="Residential Address" value={data.residentialAddress} />
            <FieldValue label="District" value={data.district} />
            <FieldValue label="Pin Code" value={data.pinCode} />
            <FieldValue label="Mobile" value={data.mobile} />
            <FieldValue label="WhatsApp" value={data.whatsapp} />
            <FieldValue label="Email ID" value={data.email} />
            <FieldValue label="Blood Group" value={data.bloodGroup} />
            <FieldValue label="ID Proof Type" value={data.idProofType} />
            <FieldValue label="ID Proof No" value={data.idProofNo} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Passport Photo</p>
              {data.photoData ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photoData} alt="Photo" className="w-24 h-24 object-cover rounded-md border border-gray-200" />
              ) : <span className="text-xs text-gray-400 italic">No photo attached</span>}
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ID Proof</p>
              {data.idProofData ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.idProofData} alt="ID Proof" className="w-32 h-24 object-cover rounded-md border border-gray-200" />
              ) : <span className="text-xs text-gray-400 italic">No proof attached</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Professional */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">2. Educational & Professional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldValue label="Educational Qualification" value={data.education} />
            <FieldValue label="Designation" value={data.designation} />
            <FieldValue label="Organization" value={data.organization} />
            <FieldValue label="Sector / Industry" value={data.sector} />
            <FieldValue label="Office Address" value={data.officeAddress} />
            <FieldValue label="Office Pin Code" value={data.officePinCode} />
            <FieldValue label="Office Contact No" value={data.officeContact} />
            <FieldValue label="Office Email / Website" value={data.officeEmail} />
            <FieldValue label="GST Status" value={data.gstStatus} />
            <FieldValue label="GST Type" value={data.gstType} />
          </div>
        </div>

        {/* Section 3: Involvement */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">3. Organizational / Political Involvement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldValue label="Member of INC?" value={data.isIncMember} />
            <FieldValue label="Past / Present roles" value={data.pastRoles} />
            <FieldValue label="Trade Associations" value={data.tradeAssoc} />
            <FieldValue label="Social Organizations" value={data.socialOrgs} />
          </div>
        </div>

        {/* Section 4: Fee */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">4. Membership Fee</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldValue label="Fee Amount" value={data.feeAmount ? `Rs. ${data.feeAmount}` : ''} />
            <FieldValue label="Mode of Payment" value={data.paymentMode} />
            <FieldValue label="Date of Payment" value={data.paymentDate} />
            <FieldValue label="Transaction Ref / Cheque No" value={data.transactionRef} />
          </div>
        </div>

        {/* Section 5: Declaration */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">5. Declaration</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-xs text-foreground/80 leading-relaxed italic border border-gray-200">
            "I hereby declare that the above information is true to the best of my knowledge. I agree to abide by the Constitution and Guidelines of the KPCC Industries Cell and understand that failure to do so may result in the termination of my membership."
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldValue label="Date" value={data.declarationDate} />
            <FieldValue label="Place" value={data.declarationPlace} />
            <FieldValue label="Signature Name" value={data.signatureName} />
          </div>
        </div>
        
        {/* Section 6: Office Use */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-4">6. For Office Use Only</h3>
          <p className="text-xs text-gray-400 italic">This section is intentionally left blank and will be filled by the office administrators.</p>
        </div>

      </div>
    </div>
  );
}
