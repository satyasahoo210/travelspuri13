/**
 * GOOGLE APPS SCRIPT BACKEND FOR TRAVELS PURI 13
 * 
 * Deployment Instructions:
 * 1. Create a Google Sheet with two tabs: "Rooms" and "Packages".
 * 2. Columns for both: id, name, description, price, duration, image_url, is_active, created_at, updated_at
 * 3. Open Extensions > Apps Script.
 * 4. Paste this code.
 * 5. Deploy > New Deployment > Web App.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and set it as NEXT_PUBLIC_API_URL in Vercel/Local .env.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  const sheetName = action === 'getRooms' ? 'Rooms' : (action === 'getPackages' ? 'Packages' : null);
  
  if (!sheetName) {
    return createResponse({ success: false, error: 'Invalid action' });
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const result = data.map(row => {
    const obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  }).filter(item => item.is_active == true || item.is_active == 'TRUE' || item.is_active === true);

  return createResponse({ success: true, data: result });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action;
  const type = body.type; // 'rooms' or 'packages'
  const sheetName = type === 'rooms' ? 'Rooms' : 'Packages';
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  
  if (action === 'add') {
    const newId = Utilities.getUuid();
    const row = [
      newId,
      body.name,
      body.description,
      body.price,
      body.duration,
      body.image_url,
      true,
      new Date().toISOString(),
      new Date().toISOString()
    ];
    sheet.appendRow(row);
    return createResponse({ success: true, id: newId });
  }

  if (action === 'update') {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === body.id) {
        // Update columns
        headers.forEach((header, j) => {
          if (body[header] !== undefined && header !== 'id') {
            sheet.getRange(i + 1, j + 1).setValue(body[header]);
          }
        });
        sheet.getRange(i + 1, headers.indexOf('updated_at') + 1).setValue(new Date().toISOString());
        return createResponse({ success: true });
      }
    }
    return createResponse({ success: false, error: 'Item not found' });
  }

  if (action === 'delete') {
    const data = sheet.getDataRange().getValues();
    const idIndex = data[0].indexOf('id');
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === body.id) {
        sheet.deleteRow(i + 1);
        return createResponse({ success: true });
      }
    }
    return createResponse({ success: false, error: 'Item not found' });
  }

  return createResponse({ success: false, error: 'Invalid action' });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
