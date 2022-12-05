const sheetYearlyDB = GSS.getSheetByName('연간 자산 DB');

const useManageAssetsDB = () => {
  const { getValueWithPosition, findPositionWithText, writeData } =
    useHelpers();

  const manageYearlyAssetsDB = (date) => {
    const monthlyExpense = getMonthlyData('Finder01', 2, 4);
    writeMonthlyData('Finder01', 'Finder02', '지출', 3, monthlyExpense, date);

    const monthlyIncome = getMonthlyData('Finder02', 1, 3);
    writeMonthlyData('Finder01', '지출', '수입', 2, monthlyIncome, date);
  };

  const getMonthlyData = (
    finder,
    categoryNameCalibration,
    valueCalibration
  ) => {
    const monthlyData = [];

    const { pinRow, pinColumn } = findPositionWithText(
      sheetMonthlySummary,
      finder
    );

    const categoryNameColumn = pinColumn + categoryNameCalibration;
    const valueColumn = pinColumn + valueCalibration;

    for (
      let low = pinRow + 1;
      getValueWithPosition(sheetMonthlySummary, low, categoryNameColumn) !== '';
      low++
    ) {
      monthlyData.push({
        categoryName: getValueWithPosition(
          sheetMonthlySummary,
          low,
          categoryNameColumn
        ),
        value: getValueWithPosition(sheetMonthlySummary, low, valueColumn),
      });
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
    const findResult = findPositionWithText(sheetYearlyDB, finderStart);

    const { pinRow } = findResult;
    let { pinColumn } = findResult;

    const getWritePinRow = ({ year, month }) => {
      const refinedYear = month === 0 ? year - 1 : year;
      const refinedMonth = month === 0 ? 12 : month;

      const yearFinder = sheetYearlyDB
        .createTextFinder(refinedYear)
        .findAll()
        .filter((el) => {
          const col = el.getColumn();

          return (
            col === 2 &&
            sheetYearlyDB.getRange(el.getRow(), col + 1).getValue() ===
              refinedMonth
          );
        });

      return yearFinder[0].getRow();
    };

    while (
      getValueWithPosition(sheetYearlyDB, pinRow, pinColumn) !== finderPoint
    ) {
      pinColumn++;
    }

    while (
      getValueWithPosition(sheetYearlyDB, pinRow, pinColumn) !== finderEnd
    ) {
      const categoryName = getValueWithPosition(
        sheetYearlyDB,
        pinRow + finderRow,
        pinColumn
      );

      if (categoryName) {
        const findCategory = data.find(
          (el) => el.categoryName === categoryName
        );

        if (findCategory)
          writeData(
            sheetYearlyDB,
            getWritePinRow(date),
            pinColumn,
            findCategory.value
          );
      }
      pinColumn++;
    }
  };

  return { manageYearlyAssetsDB };
};
