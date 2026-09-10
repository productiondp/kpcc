/**
 * KPCC Industries Cell Membership Application
 * Google Apps Script Backend
 * 
 * Instructions:
 * 1. Open your Google Drive.
 * 2. Go to New > Google Apps Script (if not visible, connect it via 'More apps').
 * 3. Paste this code into Code.gs.
 * 4. Create a folder in your Google Drive to store uploaded files (Photos and ID Proofs).
 * 5. Get the Folder ID from the URL (e.g., https://drive.google.com/drive/folders/YOUR_FOLDER_ID).
 * 6. Replace 'YOUR_FOLDER_ID_HERE' below with your actual Folder ID.
 * 7. Deploy > New Deployment > Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 8. Copy the Web app URL and put it in your Next.js .env.local file as GOOGLE_SCRIPT_URL
 */

// SPREADSHEET CONFIGURATION
const SPREADSHEET_ID = '1-GBp48hoRiQfk-z__F_3MLXWAZY6Rs4Ler59Vy7fLYk';
const SHEET_NAME = 'Sheet1'; 
const UPLOAD_FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // <-- SET THIS

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Open the explicit spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Validate sheet exists
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: `Sheet '${SHEET_NAME}' not found in spreadsheet.`
      })).setMimeType(ContentService.MimeType.JSON);
    }

    let photoUrl = '';
    let idProofUrl = '';
    
    // Initialize folder
    let folder;
    try {
      folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
    } catch (err) {
      console.log("Folder error - file uploads will be skipped", err);
    }

    // Process Photo Upload
    if (data.photoData && folder) {
      photoUrl = saveFileToDrive(data.photoData, `Photo_${data.fullName}_${new Date().getTime()}`, folder);
    }
    
    // Process ID Proof Upload
    if (data.idProofData && folder) {
      idProofUrl = saveFileToDrive(data.idProofData, `IDProof_${data.fullName}_${new Date().getTime()}`, folder);
    }

    // Append to sheet in the exact order
    const rowData = [
      new Date(), // Timestamp
      data.fullName || '',
      data.dob || '',
      data.age || '',
      data.gender || '',
      data.parentsName || '',
      data.residentialAddress || '',
      data.district || '',
      data.pinCode || '',
      data.mobile || '',
      data.whatsapp || '',
      data.email || '',
      data.bloodGroup || '',
      data.idProofType || '',
      data.idProofNo || '',
      photoUrl || '',
      idProofUrl || '',
      data.education || '',
      data.designation || '',
      data.organization || '',
      data.sector || '',
      data.officeAddress || '',
      data.officePinCode || '',
      data.officeContact || '',
      data.officeEmail || '',
      data.gstStatus || '',
      data.gstType || '',
      data.isIncMember || '',
      data.pastRoles || '',
      data.tradeAssoc || '',
      data.socialOrgs || '',
      data.feeAmount || '',
      data.paymentMode || '',
      data.paymentDate || '',
      data.transactionRef || '',
      data.declarationDate || '',
      data.declarationPlace || '',
      data.signatureName || '',
      data.membershipIdNo || '', // Office Use
      data.dateOfAdmission || '', // Office Use
      data.verifiedBy || '', // Office Use
      data.approvedBy || '', // Office Use
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Application submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper to save base64 string to Drive
 */
function saveFileToDrive(base64Data, filename, folder) {
  try {
    const typeMatch = base64Data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!typeMatch) return '';
    
    const mimeType = typeMatch[1];
    let extension = mimeType.split('/')[1];
    if (extension === 'jpeg') extension = 'jpg';
    if (extension === 'vnd.openxmlformats-officedocument.wordprocessingml.document') extension = 'docx';
    
    const base64String = base64Data.split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64String), mimeType, `${filename}.${extension}`);
    
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (e) {
    console.log("File save error", e);
    return '';
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
