const sheetYearlyDB = GSS.getSheetByName('연간 자산 데이터베이스');

const manageYearlyAssetsDB = (date) => {
  const monthlyExpense = getMonthlyData('Finder01', 2, 4);
  writeMonthlyData('Finder01', 'Finder02', '지출', 3, monthlyExpense, date);

  const monthlyIncome = getMonthlyData('Finder02', 1, 3);
  writeMonthlyData('Finder01', '지출', '수입', 2, monthlyIncome, date);
};

const getMonthlyData = (finder, namePoint, valuePoint) => {
  const monthlyData = [];

  const pinCell = sheetMonthlySummary.createTextFinder(finder).findAll();
  let pinRow = pinCell[0].getRow() + 1;
  const pinColumn = pinCell[0].getColumn();

  while (
    sheetMonthlySummary.getRange(pinRow, pinColumn + namePoint).getValue() !==
    ''
  ) {
    monthlyData.push({
      categoryName: sheetMonthlySummary
        .getRange(pinRow, pinColumn + namePoint)
        .getValue(),
      value: sheetMonthlySummary
        .getRange(pinRow, pinColumn + valuePoint)
        .getValue(),
    });

    pinRow++;
  }

  return monthlyData;
};

const writeMonthlyData = (
  finderStart,
  finderEnd,
  finderPoint,
  finderRow,
  data,
  date
) => {
  const pinCell = sheetYearlyDB.createTextFinder(finderStart).findAll();
  const pinRow = pinCell[0].getRow();
  let pinColumn = pinCell[0].getColumn();

  const writePinRow = getWritePinRow(date);

  while (sheetYearlyDB.getRange(pinRow, pinColumn).getValue() !== finderPoint) {
    pinColumn++;
  }

  while (sheetYearlyDB.getRange(pinRow, pinColumn).getValue() !== finderEnd) {
    const categoryName = sheetYearlyDB
      .getRange(pinRow + finderRow, pinColumn)
      .getValue();

    if (categoryName) {
      const findCategory = data.find((el) => el.categoryName === categoryName);

      if (findCategory)
        writeData(sheetYearlyDB, writePinRow, pinColumn, findCategory.value);
    }
    pinColumn++;
  }
};

const getWritePinRow = (date) => {
  const _year = date.month == 0 ? date.year - 1 : date.year
  const _month = date.month == 0 ? 12 : date.year

  const yearFinder = sheetYearlyDB
    .createTextFinder(_year)
    .findAll()
    .filter(
      (el) =>
        el.getColumn() == 2 &&
        sheetYearlyDB.getRange(el.getRow(), el.getColumn() + 1).getValue() ==
        _month
    );

  return yearFinder[0].getRow();
};