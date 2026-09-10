# KPCC Industries Cell Membership Application

A highly polished, interactive, production-ready web application for the KPCC Industries Cell Membership form. Built with Next.js, React Hook Form, Framer Motion, and Tailwind CSS.

## Features
- Multi-step interactive form
- Real-time validation
- File uploads for Photo and ID Proof
- Responsive modern UI (Mobile & Desktop optimized)
- Serverless Google Apps Script backend integration
- Directly saves data to your provided Google Sheet

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_SCRIPT_URL=your_google_apps_script_web_app_url_here
   ```
   *Note: If left blank, the app will simulate a successful network request for development purposes.*

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Backend Setup (Google Sheets & Drive)

Instead of a complex database, this app uses Google Apps Script as a secure serverless backend to append rows directly to your Google Sheet.

### 1. Google Drive Preparation
1. Open Google Drive.
2. Create a new folder named "KPCC Uploads".
3. Right-click the folder > Share > change access so that you own it (or make it accessible if you want the links to be public).
4. Get the **Folder ID** from the URL (e.g. `https://drive.google.com/drive/folders/YOUR_FOLDER_ID`).

### 2. Google Sheets Setup
1. Open your specific Google Spreadsheet: [Spreadsheet Link](https://docs.google.com/spreadsheets/d/1-GBp48hoRiQfk-z__F_3MLXWAZY6Rs4Ler59Vy7fLYk/edit?usp=sharing)
2. Ensure the first tab is named exactly `Sheet1`.
3. In the first row, add the headers matching the application fields (Timestamp, Full Name, DOB, Age, Gender, etc.).

### 3. Apps Script Deployment
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Copy the entire contents of the `google-apps-script/Code.gs` file from this repository and paste it into the editor.
3. Replace `'YOUR_FOLDER_ID_HERE'` at the top of the script with your actual Folder ID.
4. Click **Deploy > New deployment**.
5. Select type: **Web app**.
6. Set "Execute as" to **Me**.
7. Set "Who has access" to **Anyone**.
8. Click **Deploy**. (You will need to authorize the script).
9. Copy the provided **Web app URL**.

## Deployment (Vercel)

This Next.js app is perfectly optimized for Vercel.

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. In the Environment Variables section during setup, add:
   - Key: `GOOGLE_SCRIPT_URL`
   - Value: `[Your Web app URL from Apps Script]`
4. Click **Deploy**.

## Data Mapping Audit

| PDF Field | Frontend Field (React State) | API Field Name | Google Sheet Column (A-Z) |
| --- | --- | --- | --- |
| Timestamp (System Generated) | - | - | 1 (A) |
| 01. Full Name | `fullName` | `fullName` | 2 (B) |
| 02. Date of Birth | `dob` | `dob` | 3 (C) |
| Age | `age` | `age` | 4 (D) |
| Gender | `gender` | `gender` | 5 (E) |
| 03. Father's / Mother's Name | `parentsName` | `parentsName` | 6 (F) |
| 04. Residential Address | `residentialAddress` | `residentialAddress` | 7 (G) |
| 05. District / Assembly Constituency | `district` | `district` | 8 (H) |
| Pin Code | `pinCode` | `pinCode` | 9 (I) |
| 06. Contact Number (Mobile) | `mobile` | `mobile` | 10 (J) |
| WhatsApp Number | `whatsapp` | `whatsapp` | 11 (K) |
| 07. Email ID | `email` | `email` | 12 (L) |
| Blood Group | `bloodGroup` | `bloodGroup` | 13 (M) |
| 08. ID Proof Type | `idProofType` | `idProofType` | 14 (N) |
| ID Proof No | `idProofNo` | `idProofNo` | 15 (O) |
| Affix Passport Size Photo Here | `photoData` (Base64) | `photoData` -> Drive URL | 16 (P) |
| (attach copy) - ID Proof | `idProofData` (Base64) | `idProofData` -> Drive URL | 17 (Q) |
| 09. Educational Qualification | `education` | `education` | 18 (R) |
| 10. Designation | `designation` | `designation` | 19 (S) |
| 11. Name of Organization | `organization` | `organization` | 20 (T) |
| 12. Sector / Industry | `sector` | `sector` | 21 (U) |
| 13. Office Address | `officeAddress` | `officeAddress` | 22 (V) |
| Pin Code (Office) | `officePinCode` | `officePinCode` | 23 (W) |
| 14. Office Contact No | `officeContact` | `officeContact` | 24 (X) |
| 15. Office Email / Website | `officeEmail` | `officeEmail` | 25 (Y) |
| 16. GST Registration Status | `gstStatus` | `gstStatus` | 26 (Z) |
| 17. Type of GST Registration | `gstType` | `gstType` | 27 (AA) |
| 18. Are you a member of INC? | `isIncMember` | `isIncMember` | 28 (AB) |
| 19. Past / Present roles... | `pastRoles` | `pastRoles` | 29 (AC) |
| 20. Membership in Trade... | `tradeAssoc` | `tradeAssoc` | 30 (AD) |
| 21. Social / Voluntary Org... | `socialOrgs` | `socialOrgs` | 31 (AE) |
| 22. Membership Fee Amount | `feeAmount` | `feeAmount` | 32 (AF) |
| 23. Mode of Payment | `paymentMode` | `paymentMode` | 33 (AG) |
| 24. Date of Payment | `paymentDate` | `paymentDate` | 34 (AH) |
| Payment Transaction Ref... | `transactionRef` | `transactionRef` | 35 (AI) |
| Declaration Date | `declarationDate` | `declarationDate` | 36 (AJ) |
| Declaration Place | `declarationPlace` | `declarationPlace` | 37 (AK) |
| Signature of Applicant | `signatureName` | `signatureName` | 38 (AL) |
| Membership ID No | `membershipIdNo` | `membershipIdNo` | 39 (AM) |
| Date of Admission | `dateOfAdmission` | `dateOfAdmission` | 40 (AN) |
| Verified By | `verifiedBy` | `verifiedBy` | 41 (AO) |
| Approved By | `approvedBy` | `approvedBy` | 42 (AP) |

## Production Workflow

The precise data flow architecture from the database to the applicant is as follows:

Google Sheet → Apps Script → GOOGLE_SCRIPT_URL → Next.js /api/submit → Vercel → applicant
- All file uploads are converted to Base64 and handled server-side by Google Apps Script.

## Security Notes
- No Google Service Account credentials or API keys are exposed to the client.
- The Next.js API route securely proxies the request to the Google Apps Script endpoint.
- Server-side validation restricts payloads larger than 4MB.
