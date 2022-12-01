const sheetMonthlyInfo = GSS.getSheetByName('월간 거래');
const sheetMonthlyInfosDB = GSS.getSheetByName('월간 거래 DB');

const useMonthlyInfosDB = () => {
  const { getValueWithPosition, findPositionWithText, writeData } =
    useHelpers();

  const checkMonthlyInfosPosition = (refinedYear, refinedMonth) => {
    const lastColumn = sheetMonthlyInfosDB.getLastColumn();

    const checkDateValue = (targetDate, nowDate) => {
      if (!targetDate.year || !targetDate.month) {
        return '';
      }

      if (
        targetDate.year === nowDate.year &&
        targetDate.month === nowDate.month
      ) {
        console.log('Collect Year, Collect Month');
        // write
        return 'overwrite';
      }

      if (
        targetDate.year === nowDate.year &&
        targetDate.month < nowDate.month
      ) {
        console.log('Collect Year, Not Collect Month');
        // add
        // write
        return 'paste';
      }

      if (targetDate.year < nowDate.year && targetDate.month < nowDate.month) {
        console.log('Not Collect Year, Not Collect Month');
        // add
        // write
        return 'paste';
      }
    };

    for (let i = lastColumn; i > 0; i--) {
      const targetYear = getValueWithPosition(sheetMonthlyInfosDB, 3, i);
      const targetMonth = getValueWithPosition(sheetMonthlyInfosDB, 4, i);

      const action = checkDateValue(
        { year: targetYear, month: targetMonth },
        { year: refinedYear, month: refinedMonth }
      );

      if (action !== '') {
        return { action, column: i };
      }
    }
  };

  const addColumns = (column) => {
    const lastColumn = sheetMonthlyInfosDB.getLastColumn();
    sheetMonthlyInfosDB.insertColumnsAfter(lastColumn + 1, 13);

    const monthlyInfosHeaders = [
      '날짜',
      '결제 금액',
      '설명',
      '소비 금액',
      '카테고리',
      '결제 수단',
      '',
      '날짜',
      '금액',
      '설명',
      '카테고리',
      '받은 수단',
    ];

    monthlyInfosHeaders.forEach((header, index) => {
      console.log(header, column + 13, index);
    });
  };

  const getMonthlyInfoRange = () => {
    const { pinRow, pinColumn } = findPositionWithText(
      sheetMonthlyInfo,
      'Finder01'
    );

    const refinedRow = pinRow + 2;

    const lastRow = sheetMonthlyInfo.getLastRow();

    return sheetMonthlyInfo.getRange(refinedRow, pinColumn, lastRow, 12);
  };

  const writeMonthlyInfo = (action, column, monthlyInfoRange) => {
    const refinedColumn = action === 'overwrite' ? column : column + 13;

    console.log(8, refinedColumn);
    console.log(monthlyInfoRange);

    // monthlyInfoRange.copyTo(
    //   sheetMonthlyInfosDB.getRange(8, refinedColumn, lastRow, 12)
    // );
  };

  const deleteMonthlyInfo = (range) => {
    range.clear({ contentsOnly: true });
  };

  const updateMonthlyInfos = ({ year, month }) => {
    const refinedYear = month === 0 ? year - 1 : year;
    const refinedMonth = month === 0 ? 12 : month;

    const { action, column } = checkMonthlyInfosPosition(
      refinedYear,
      refinedMonth
    );

    if (action === 'paste') {
      addColumns(column);
    }

    // const monthlyInfoRange = getMonthlyInfoRange();
    // writeMonthlyInfo(action, column, monthlyInfoRange);
    // deleteMonthlyInfo(monthlyInfoRange);
  };

  return {
    updateMonthlyInfos,
  };
};
