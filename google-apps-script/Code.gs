/**
 * KPCC Industries Cell Membership Application
 * Google Apps Script Backend - PRODUCTION READY
 */

const SPREADSHEET_ID = '1-GBp48hoRiQfk-z__F_3MLXWAZY6Rs4Ler59Vy7fLYk';
const SHEET_NAME = 'Form Responses'; 
const UPLOAD_FOLDER_ID = '1cVYMG_U7N36Omhc2D6py_rFTM4kKjcNa';

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getApplications') {
    return handleGetApplications();
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'KPCC Membership API is running.'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetApplications() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = values[0];
    const applications = [];
    
    for (let i = 1; i < values.length; i++) {
      let app = {};
      for (let j = 0; j < headers.length; j++) {
        app[headers[j]] = values[i][j];
      }
      applications.push(app);
    }
    
    // Sort applications by Timestamp descending (newest first)
    applications.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: applications
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // Use LockService to prevent concurrent writes corrupting rows
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds for other processes to finish
    lock.waitLock(10000); 
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Server is busy. Please try again later.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Validate request payload
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Malformed request: No data received.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Malformed request: Invalid JSON.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Admin Action: Update Office Use
    if (data.action === 'updateOfficeUse') {
      return handleUpdateOfficeUse(data);
    }
    
    // Admin Action: Approve Application
    if (data.action === 'approveApplication') {
      return handleApproveApplication(data);
    }
    
    // File Upload Action (Split Upload Architecture)
    if (data.action === 'uploadFile') {
      return handleUploadFile(data);
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Auto-create sheet and headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "Application Form No.", "Timestamp", "01. Full Name", "02. Date of Birth", "Age", "Gender", 
        "03. Father's / Mother's Name", "04. Residential Address", "05. District / Assembly Constituency", 
        "Pin Code", "06. Contact Number (Mobile)", "WhatsApp Number", "07. Email ID", 
        "Blood Group", "08. ID Proof Type", "ID Proof No", "Passport Size Photo", 
        "ID Proof Copy", "09. Educational Qualification", "10. Designation", "11. Name of Organization", 
        "12. Sector / Industry", "13. Office Address", "Pin Code (Office)", "14. Office Contact No", 
        "15. Office Email / Website", "16. GST Registration Status", "17. Type of GST Registration", 
        "18. Are you a member of INC?", "19. Past / Present roles...", "20. Membership in Trade...", 
        "21. Social / Voluntary Org...", "22. Membership Fee Amount", "23. Mode of Payment", 
        "24. Date of Payment", "Payment Transaction Ref...", "Declaration Date", "Declaration Place", 
        "Signature of Applicant", "Membership ID No", "Date of Admission", "Verified By", "Approved By",
        "Application Status", "Approval Timestamp", "Certificate URL", "Certificate Token", "Certificate Email Sent", "WhatsApp Status"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    // Generate unique Application Form No.
    const scriptProps = PropertiesService.getScriptProperties();
    let currentCounter = parseInt(scriptProps.getProperty('APPLICATION_COUNTER') || '0', 10);
    currentCounter += 1;
    scriptProps.setProperty('APPLICATION_COUNTER', currentCounter.toString());
    
    // Format: KPCC-2026-000001
    const applicationNo = `KPCC-2026-${currentCounter.toString().padStart(6, '0')}`;

    let photoUrl = '';
    let idProofUrl = '';
    
    // Initialize folder
    let folder;
    try {
      if (UPLOAD_FOLDER_ID && UPLOAD_FOLDER_ID !== 'YOUR_FOLDER_ID_HERE') {
        folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
      }
    } catch (err) {
      console.log("Folder configuration error", err);
    }

    // Process Photo Upload (Support both new URL-based and old Base64-based payload)
    if (data.photoUrl) {
      photoUrl = data.photoUrl;
    } else if (data.photoData && folder) {
      const res = saveFileToDrive(data.photoData, `Photo_${data.fullName}_${new Date().getTime()}`, folder);
      photoUrl = res.url || '';
    }
    
    // Process ID Proof Upload
    if (data.idProofUrl) {
      idProofUrl = data.idProofUrl;
    } else if (data.idProofData && folder) {
      const res = saveFileToDrive(data.idProofData, `IDProof_${data.fullName}_${new Date().getTime()}`, folder);
      idProofUrl = res.url || '';
    }

    // Append to sheet in the exact order mapped to the Next.js payload
    const rowData = [
      applicationNo,
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
      data.membershipIdNo || '', 
      data.dateOfAdmission || '', 
      data.verifiedBy || '', 
      data.approvedBy || '', 
      'Submitted', // Application Status
      '', // Approval Timestamp
      '', // Certificate URL
      '', // Certificate Token
      '', // Certificate Email Sent
      'Not Configured', // WhatsApp Status
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      applicationNo: applicationNo,
      message: 'Application submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function handleUpdateOfficeUse(data) {
  if (!data.applicationNo) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Application Number is required for update.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Database not initialized.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  // Find column indices (0-indexed)
  const appNoIdx = headers.indexOf("Application Form No.");
  const memIdIdx = headers.indexOf("Membership ID No");
  const dateAdmIdx = headers.indexOf("Date of Admission");
  const verifiedIdx = headers.indexOf("Verified By");
  const approvedIdx = headers.indexOf("Approved By");
  
  if (appNoIdx === -1 || memIdIdx === -1) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Schema error: Could not find required columns.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Find target row
  let targetRowIdx = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][appNoIdx] === data.applicationNo) {
      targetRowIdx = i;
      break;
    }
  }
  
  if (targetRowIdx === -1) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Application not found.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Update sheet (row is 1-indexed, so add 1)
  const rowNum = targetRowIdx + 1;
  
  // Column is 1-indexed
  if (data.membershipIdNo !== undefined) sheet.getRange(rowNum, memIdIdx + 1).setValue(data.membershipIdNo);
  if (data.dateOfAdmission !== undefined) sheet.getRange(rowNum, dateAdmIdx + 1).setValue(data.dateOfAdmission);
  if (data.verifiedBy !== undefined) sheet.getRange(rowNum, verifiedIdx + 1).setValue(data.verifiedBy);
  if (data.approvedBy !== undefined) sheet.getRange(rowNum, approvedIdx + 1).setValue(data.approvedBy);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Office Use updated successfully.'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleApproveApplication(data) {
  if (!data.applicationNo) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Application Number is required for approval.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Database not initialized.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  // Find column indices
  const appNoIdx = headers.indexOf("Application Form No.");
  const statusIdx = headers.indexOf("Application Status");
  const apprTimeIdx = headers.indexOf("Approval Timestamp");
  const certUrlIdx = headers.indexOf("Certificate URL");
  const certTokenIdx = headers.indexOf("Certificate Token");
  const certEmailIdx = headers.indexOf("Certificate Email Sent");
  
  if (appNoIdx === -1 || statusIdx === -1) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Schema error: Could not find required columns. Please resave an application to initialize schema.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Find target row
  let targetRowIdx = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][appNoIdx] === data.applicationNo) {
      targetRowIdx = i;
      break;
    }
  }
  
  if (targetRowIdx === -1) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Application not found.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const rowNum = targetRowIdx + 1;
  const currentStatus = sheet.getRange(rowNum, statusIdx + 1).getValue();

  if (currentStatus === 'Approved') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Application is already approved.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const token = data.certificateToken || Utilities.getUuid();
  const timestamp = new Date().toISOString();

  sheet.getRange(rowNum, statusIdx + 1).setValue('Approved');
  if (apprTimeIdx !== -1) sheet.getRange(rowNum, apprTimeIdx + 1).setValue(timestamp);
  if (certUrlIdx !== -1 && data.certificateUrl) sheet.getRange(rowNum, certUrlIdx + 1).setValue(data.certificateUrl);
  if (certTokenIdx !== -1) sheet.getRange(rowNum, certTokenIdx + 1).setValue(token);
  if (certEmailIdx !== -1 && data.emailSent) sheet.getRange(rowNum, certEmailIdx + 1).setValue('Yes');
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    token: token,
    message: 'Application approved successfully.'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleUploadFile(data) {
  if (!data.fileData || !data.fileName) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Missing file data or filename.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  let folder;
  try {
    if (UPLOAD_FOLDER_ID && UPLOAD_FOLDER_ID !== 'YOUR_FOLDER_ID_HERE') {
      folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Google Drive folder ID is not configured on the backend.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Folder access error: ' + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const fileRes = saveFileToDrive(data.fileData, data.fileName, folder);
  
  if (!fileRes.url) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Drive Upload Error: ' + (fileRes.error || 'Unknown failure')
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    url: fileRes.url
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper to save base64 string to Drive
 */
function saveFileToDrive(base64Data, filename, folder) {
  try {
    const typeMatch = base64Data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!typeMatch) return { url: null, error: 'Invalid Base64 Data Format (missing data:mime/type)' };
    
    const mimeType = typeMatch[1];
    let extension = mimeType.split('/')[1];
    if (extension === 'jpeg') extension = 'jpg';
    if (extension === 'vnd.openxmlformats-officedocument.wordprocessingml.document') extension = 'docx';
    
    const base64String = base64Data.split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64String), mimeType, `${filename}.${extension}`);
    
    const file = folder.createFile(blob);
    return { url: file.getUrl(), error: null };
  } catch (e) {
    console.log("File save error", e);
    return { url: null, error: e.toString() };
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
