const sheet_Payback = GSS.getSheetByName("상환금");

const writePayback = () => {
  const row = sheet_Payback.getLastRow();
  const paybackPrice = forPayback();
  if (sheet_Payback.getRange(row, 3).getValue() != paybackPrice) {
    sheet_Payback.getRange(row + 1, 2).setValue(new Date());
    sheet_Payback.getRange(row + 1, 3).setValue(paybackPrice);
  }
};

const forPayback = () => {
  const pinCell = sheet_MonthlyList.createTextFinder("Finder01").findAll();
  const pinCol = pinCell[0].getColumn();
  const pinRow = pinCell[0].getRow();
  return sheet_MonthlyList.getRange(pinRow - 1, pinCol + 3).getValue();
};
