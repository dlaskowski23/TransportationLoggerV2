const spreadsheetID = "1MuQABisfTMRM7O5tk2uaBBxc6dGAXYSAGkLnpnXthyM"

function logTrip(name, date, tripFrom, tripTo) {
  const RATE = 0.47;

  const DISTANCE = {
    Gillette: { Millington: 3.0, Central: 2.1 },
    Millington: { Gillette: 3.0, Central: 1.7 },
    Central: { Gillette: 2.1, Millington: 1.7 }
  };

  var ss = SpreadsheetApp.openById(spreadsheetID);
  var sheet = ss.getSheetByName(name);

  if (tripFrom == tripTo) {
    return { ok: false, error: "same_location" };
  }

  var miles = (DISTANCE[tripFrom] && DISTANCE[tripFrom][tripTo]) || 0;
  // round to 2 decimals but keep as number
  miles = Math.round(miles * 100) / 100;

  var amount = Math.round(miles * RATE * 100) / 100;

  // Append row: A:Date, B:From, C:To, D:Miles, E:Amount
  sheet.appendRow([date, tripFrom, tripTo, miles, amount]);

  // Optional: keep your counters
  var incrementCell;

  switch (tripFrom) {
    case "Gillette":
      if (tripTo == "Millington") incrementCell = "G2";
      else if (tripTo == "Central") incrementCell = "F2";
      break;
    case "Central":
      if (tripTo == "Millington") incrementCell = "H2";
      else if (tripTo == "Gillette") incrementCell = "F2";
      break;
    case "Millington":
      if (tripTo == "Gillette") incrementCell = "G2";
      else if (tripTo == "Central") incrementCell = "H2";
      break;
  }

  if (incrementCell) {
    var v = Number(sheet.getRange(incrementCell).getValue()) || 0;
    sheet.getRange(incrementCell).setValue(v + 1);
  }

  return { ok: true, miles: miles, amount: amount, rate: RATE };

}

function doGet(e) {
  var user = Session.getActiveUser().getEmail()
  var isMobile = e && e.parameter && e.parameter.ui === 'mobile';

  if (user === 'dlaskowski@longhill.org' || user === 'david.1120.laskowski@gmail.com') {
    return HtmlService.createHtmlOutputFromFile(isMobile ? 'USER1_MOBILE' : 'USER1');
  } 
  else if (user === 'Jackhartnett24@gmail.com' || user === 'jhartnett@longhill.org') {
    return HtmlService.createHtmlOutputFromFile(isMobile ? 'USER2_MOBILE' : 'USER2');
  }
  else{
    return HtmlService.createHtmlOutput('Access not recognized or authorized.');
  }
}