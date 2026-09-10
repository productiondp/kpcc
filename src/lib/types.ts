export interface FormData {
  // Step 1: Personal Info
  fullName: string;
  dob: string;
  age: string;
  gender: string;
  parentsName: string;
  residentialAddress: string;
  district: string;
  pinCode: string;
  mobile: string;
  whatsapp: string;
  email: string;
  bloodGroup: string;
  idProofType: string;
  idProofNo: string;
  photoData?: string; // base64 for upload
  idProofData?: string; // base64 for upload

  // Step 2: Professional
  education: string;
  designation: string;
  organization: string;
  sector: string;
  officeAddress: string;
  officePinCode: string;
  officeContact: string;
  officeEmail: string;
  gstStatus: string;
  gstType: string;

  // Step 3: Involvement
  isIncMember: string;
  pastRoles: string;
  tradeAssoc: string;
  socialOrgs: string;

  // Step 4: Payment
  feeAmount: string;
  paymentMode: string;
  paymentDate: string;
  transactionRef: string;

  // Step 5: Declaration
  declarationDate: string;
  declarationPlace: string;
  signatureName: string;

  // Step 6: Office Use
  membershipIdNo: string;
  dateOfAdmission: string;
  verifiedBy: string;
  approvedBy: string;
}

export const defaultFormData: FormData = {
  fullName: '', dob: '', age: '', gender: '', parentsName: '', residentialAddress: '',
  district: '', pinCode: '', mobile: '', whatsapp: '', email: '', bloodGroup: '',
  idProofType: '', idProofNo: '', photoData: '', idProofData: '',
  education: '', designation: '', organization: '', sector: '', officeAddress: '',
  officePinCode: '', officeContact: '', officeEmail: '', gstStatus: '', gstType: '',
  isIncMember: '', pastRoles: '', tradeAssoc: '', socialOrgs: '',
  feeAmount: '', paymentMode: '', paymentDate: '', transactionRef: '',
  declarationDate: '', declarationPlace: '', signatureName: '',
  membershipIdNo: '', dateOfAdmission: '', verifiedBy: '', approvedBy: ''
};
