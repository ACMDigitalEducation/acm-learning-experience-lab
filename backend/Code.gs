/**
 * ACM Learning Experience Lab - Google Apps Script collection endpoint.
 * Create a Google Sheet, then Extensions > Apps Script and paste this file.
 * Deploy > New deployment > Web app > Execute as: Me > Access: Anyone.
 * Set SCRIPT PROPERTY `SHEET_ID` to the spreadsheet ID (recommended), or use the bound spreadsheet.
 * Optional SCRIPT PROPERTY `STUDY_SECRET` is NOT suitable as a browser-side secret; do not use for authentication.
 */
const HEADERS = ['receivedAt','responseId','submittedAt','device','order','layout','task','success','seconds','otherActivityClicks','preferredNavigation','preferredStyle','ease','comment','sessionSeconds','studyVersion'];
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents || e.postData.contents.length > 30000) throw Error('Invalid payload');
    const data = JSON.parse(e.postData.contents);
    if (data.consent !== true || !/^ux-[a-z0-9-]{5,70}$/i.test(String(data.responseId || ''))) throw Error('Invalid consent or response ID');
    if (!Array.isArray(data.results) || data.results.length !== 9) throw Error('Expected 9 tasks');
    if (!['accordion','dropdown','current'].includes(data.feedback?.navigation)) throw Error('Invalid navigation');
    if (!['minimal','visual'].includes(data.feedback?.style)) throw Error('Invalid style');
    if (!['1','2','3','4','5'].includes(String(data.feedback?.ease))) throw Error('Invalid rating');
    const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw Error('Spreadsheet not configured');
    let sheet = ss.getSheetByName('Responses');
    if (!sheet) { sheet = ss.insertSheet('Responses'); sheet.appendRow(HEADERS); sheet.setFrozenRows(1); }
    const safe = value => { const s = String(value ?? '').slice(0,1500); return /^[=+\-@\t\r]/.test(s) ? "'"+s : s; };
    const rows = data.results.map(r => [new Date(),safe(data.responseId),safe(data.submittedAt),safe(data.device),safe(data.order),safe(r.layout),safe(r.task),r.success === true,Math.max(0,Number(r.seconds)||0),Math.max(0,Number(r.otherActivityClicks)||0),safe(data.feedback.navigation),safe(data.feedback.style),Number(data.feedback.ease),safe(data.feedback.comment),Math.max(0,Number(data.sessionSeconds)||0),safe(data.version)]);
    lock.waitLock(10000);
    try { sheet.getRange(sheet.getLastRow()+1,1,rows.length,HEADERS.length).setValues(rows); } finally {lock.releaseLock();}
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) { return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err.message)})).setMimeType(ContentService.MimeType.JSON); }
}
function doGet() { return ContentService.createTextOutput('ACM Learning Experience Lab collection endpoint'); }
