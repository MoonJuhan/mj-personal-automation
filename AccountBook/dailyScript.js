function writePayback() {
  var row = sheet_Payback.getLastRow();
  var price = sheet_Payback.getRange(row, 3).getValue();
  var paybackPrice = forPayback();
  if (price != paybackPrice) {
    var time = new Date();
    sheet_Payback.getRange(row + 1, 2).setValue(time);
    sheet_Payback.getRange(row + 1, 3).setValue(paybackPrice);
  }
}

function forPayback() {
  var pinCell = sheet_MonthlyList.createTextFinder("Finder01").findAll();
  var pinCol = pinCell[0].getColumn();
  var pinRow = pinCell[0].getRow();
  return sheet_MonthlyList.getRange(pinRow - 1, pinCol + 3).getValue();
}
