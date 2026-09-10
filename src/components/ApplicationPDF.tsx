import React from 'react';
import { FormData } from '@/lib/types';

interface ApplicationPDFProps {
  data: FormData;
  applicationNo: string;
}

export default function ApplicationPDF({ data, applicationNo }: ApplicationPDFProps) {
  const Field = ({ label, value }: { label: string, value: string | undefined }) => (
    <div className="mb-2">
      <span className="font-bold text-xs uppercase text-gray-700 mr-2">{label}:</span>
      <span className="text-sm font-medium border-b border-gray-300 pb-0.5 inline-block min-w-[100px]">
        {value || <span className="text-transparent">----------</span>}
      </span>
    </div>
  );

  return (
    <div className="w-[800px] bg-white p-12 text-black font-sans mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-primary pb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="KPCC Logo" className="w-20 h-20 object-contain" />
        <div className="text-center flex-grow px-4">
          <h1 className="text-2xl font-bold text-primary uppercase">KPCC Industries Cell</h1>
          <p className="text-[10px] font-semibold mt-1">
            INDIRA BHAVAN, VELLAYAMBALAM-SASTHAMANGALAM ROAD,<br />
            SASTHAMANGALAM P.O, THIRUVANANTHAPURAM, KERALA, PIN: 695010
          </p>
          <p className="text-[10px] mt-1">TEL. (O): 0471-2721401 | EMAIL: pcckerala@gmail.com</p>
        </div>
        <div className="w-24 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center relative bg-gray-50 overflow-hidden">
          {data.photoData ? (
             // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photoData} alt="Photo" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400 text-center px-2">Affix Passport Size Photo Here</span>
          )}
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold uppercase underline underline-offset-4">Membership Application Form</h2>
        <div className="mt-4 inline-block border-2 border-primary px-4 py-1 font-bold">
          Application Form No: {applicationNo}
        </div>
      </div>

      {/* SECTION 1 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="01. Full Name (in block letters)" value={data.fullName} />
          <Field label="02. Date of Birth" value={data.dob} />
          <Field label="Age" value={data.age} />
          <Field label="Gender" value={data.gender} />
          <div className="col-span-2">
            <Field label="03. Father's / Mother's Name" value={data.parentsName} />
          </div>
          <div className="col-span-2">
            <Field label="04. Residential Address" value={data.residentialAddress} />
          </div>
          <Field label="05. District / Assembly Constituency" value={data.district} />
          <Field label="Pin Code" value={data.pinCode} />
          <Field label="06. Contact Number (Mobile)" value={data.mobile} />
          <Field label="WhatsApp Number" value={data.whatsapp} />
          <Field label="07. Email ID" value={data.email} />
          <Field label="Blood Group" value={data.bloodGroup} />
          <Field label="08. ID Proof Type" value={data.idProofType} />
          <Field label="ID Proof No" value={data.idProofNo} />
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="09. Educational Qualification" value={data.education} />
          </div>
          <Field label="10. Designation" value={data.designation} />
          <div className="col-span-2">
            <Field label="11. Name of Organization / Company / Business" value={data.organization} />
          </div>
          <Field label="12. Sector / Industry" value={data.sector} />
          <div className="col-span-2">
            <Field label="13. Office Address" value={data.officeAddress} />
          </div>
          <Field label="Pin Code" value={data.officePinCode} />
          <Field label="14. Office Contact No" value={data.officeContact} />
          <Field label="15. Office Email / Website" value={data.officeEmail} />
          <Field label="16. GST Registration Status" value={data.gstStatus} />
          <Field label="17. Type of GST Registration" value={data.gstType} />
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <Field label="18. Are you a member of Indian National Congress?" value={data.isIncMember} />
          <Field label="19. Past / Present roles in KSU / IYC / DCC / BCC / Other" value={data.pastRoles} />
          <Field label="20. Membership in Trade / Industry Associations (if any)" value={data.tradeAssoc} />
          <Field label="21. Social / Voluntary Organization memberships" value={data.socialOrgs} />
        </div>
      </div>

      {/* SECTION 4 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="22. Membership Fee Amount" value={data.feeAmount ? `Rs. ${data.feeAmount}` : ''} />
          <Field label="23. Mode of Payment" value={data.paymentMode} />
          <Field label="24. Date of Payment" value={data.paymentDate} />
          <Field label="Payment Transaction Ref / Cheque No" value={data.transactionRef} />
        </div>
      </div>

      {/* DECLARATION */}
      <div className="mb-8 p-4 border border-gray-300">
        <h3 className="font-bold text-sm mb-2 text-center uppercase underline">Declaration</h3>
        <p className="text-xs leading-relaxed italic text-justify mb-6">
          "I hereby declare that the above information is true to the best of my knowledge. I agree to abide by the Constitution and Guidelines of the KPCC Industries Cell and understand that failure to do so may result in the termination of my membership."
        </p>
        
        <div className="flex justify-between items-end">
          <div>
            <Field label="Date" value={data.declarationDate} />
            <Field label="Place" value={data.declarationPlace} />
          </div>
          <div className="text-center w-48">
            <div className="border-b border-gray-400 h-8 mb-2 font-script text-xl">{data.signatureName}</div>
            <span className="text-[10px] font-bold uppercase">Signature of Applicant</span>
          </div>
        </div>
      </div>

      {/* OFFICE USE */}
      <div className="border-2 border-gray-800 p-4 relative pt-6">
        <div className="absolute -top-3 left-4 bg-white px-2 font-bold text-xs">FOR OFFICE USE ONLY</div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <Field label="Membership ID No." value={data.membershipIdNo} />
            <Field label="Date of Admission" value={data.dateOfAdmission} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <span className="font-bold text-xs uppercase text-gray-700 block mb-6">Verified By (Name & Sign):</span>
              <div className="border-b border-gray-400 w-full"></div>
            </div>
            <div>
              <span className="font-bold text-xs uppercase text-gray-700 block mb-6">Approved By (Name & Sign):</span>
              <div className="border-b border-gray-400 w-full"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
