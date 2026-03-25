/**
 * GOOGLE APPS SCRIPT BACKEND FOR TRAVELS PURI 13 (HOTEL AGGREGATOR)
 * 
 * Deployment Instructions:
 * 1. Create a Google Sheet with two tabs: "Hotels" and "Rooms".
 * 2. Sheet: Hotels
 *    id | name | slug | location | area | lat | lng | rating | rating_count | starting_price | amenities | amenities_search | cover_image | image_urls | is_sponsored | is_active | created_at
 * 3. Sheet: Rooms
 *    id | hotel_id | name | description | price | capacity | amenities | amenities_search | image_urls | check_in | check_out | rules | cancellation_policy | is_active
 * 4. Open Extensions > Apps Script.
 * 5. Paste this code.
 * 6. Deploy > New Deployment > Web App.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  const sheetName = action === 'getHotels' ? 'Hotels' : (action === 'getRooms' ? 'Rooms' : null);
  
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
  const type = body.type; // 'hotels' or 'rooms'
  const sheetName = type === 'hotels' ? 'Hotels' : 'Rooms';
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  
  if (action === 'add') {
    const newId = Utilities.getUuid();
    const dataRow = prepareRow(body, sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0], newId);
    sheet.appendRow(dataRow);
    return createResponse({ success: true, id: newId });
  }

  if (action === 'update') {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === body.id) {
        headers.forEach((header, j) => {
          if (body[header] !== undefined && header !== 'id') {
            sheet.getRange(i + 1, j + 1).setValue(body[header]);
          }
        });
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

function prepareRow(body, headers, id) {
  return headers.map(header => {
    if (header === 'id') return id;
    if (header === 'created_at') return new Date().toISOString();
    if (header === 'is_active') return true;
    if (header === 'is_sponsored') return body.is_sponsored || false;
    if (header === 'slug' && !body.slug) {
      return body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return body[header] !== undefined ? body[header] : "";
  });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
