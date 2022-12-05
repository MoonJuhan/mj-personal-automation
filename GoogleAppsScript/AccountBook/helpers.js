const useHelpers = () => {
  const getValueWithPosition = (sheet, row, col) =>
    sheet.getRange(row, col).getValue();

  const findPositionWithText = (sheet, text) => {
    const pinCell = sheet.createTextFinder(text).findAll();

    const pinRow = pinCell[0].getRow();
    const pinColumn = pinCell[0].getColumn();

    return { pinRow, pinColumn };
  };

  const writeData = (sheet, row, col, data) => {
    console.log(
      `${sheet.getName()} - ${row}, ${col} - ${sheet
        .getRange(row, col)
        .getValue()} -> ${data}`
    );

    return sheet.getRange(row, col).setValue(data);
  };

  return { getValueWithPosition, findPositionWithText, writeData };
};
