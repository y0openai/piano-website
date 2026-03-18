function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('동의기록');
  var data = JSON.parse(e.parameter.data);

  var consents = data.consents.map(function(c) {
    return c.label + ': ' + (c.checked ? 'O' : 'X');
  }).join(' | ');

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.phone,
    data.email,
    data.ip,
    data.user_agent,
    consents
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok' })
  ).setMimeType(ContentService.MimeType.JSON);
}
