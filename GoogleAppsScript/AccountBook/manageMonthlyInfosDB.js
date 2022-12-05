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

  const addHeaderColumns = (year, month, column) => {
    const lastColumn = sheetMonthlyInfosDB.getLastColumn();
    sheetMonthlyInfosDB.insertColumnsAfter(lastColumn + 1, 13);

    const monthlyInfosHeaders = [
      { value: '날짜', width: 50, additionalValue: '지출' },
      { value: '결제 금액', width: 60 },
      { value: '설명', width: 80 },
      { value: '소비 금액', width: 60 },
      { value: '카테고리', width: 80 },
      { value: '결제 수단', width: 110 },
      { value: '', width: 40 },
      { value: '날짜', width: 50, additionalValue: '수입' },
      { value: '금액', width: 60 },
      { value: '설명', width: 80 },
      { value: '카테고리', width: 80 },
      { value: '받은 수단', width: 80 },
    ];

    const refinedColumn = column + monthlyInfosHeaders.length + 1;

    sheetMonthlyInfosDB
      .getRange(6, refinedColumn, 1, monthlyInfosHeaders.length)
      .setValues([monthlyInfosHeaders.map(({ value }) => value)])
      .setFontSize(8);

    monthlyInfosHeaders.forEach(({ width, additionalValue }, index) => {
      const targetColumn = refinedColumn + index;

      if (additionalValue) {
        writeData(
          sheetMonthlyInfosDB,
          5,
          targetColumn,
          additionalValue
        ).setFontSize(10);
      }

      sheetMonthlyInfosDB.setColumnWidths(targetColumn, 1, width);
    });

    sheetMonthlyInfosDB
      .getRange(3, refinedColumn, 2)
      .setValues([[year], [month]])
      .setFontSize(12);

    sheetMonthlyInfosDB
      .getRange(3, refinedColumn, 4, monthlyInfosHeaders.length)
      .setFontWeight('bold')
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle');
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

    const rangeLastRow = monthlyInfoRange.getLastRow();

    const targetRange = sheetMonthlyInfosDB.getRange(
      7,
      refinedColumn,
      rangeLastRow,
      13
    );

    monthlyInfoRange.copyTo(targetRange, { contentsOnly: true });

    const monthlyInfoFormats = new Array(rangeLastRow).fill([
      'm월 dd일',
      '₩0,000',
      '',
      '₩0,000',
      '',
      '',
      '',
      'm월 dd일',
      '₩0,000',
      '',
      '',
      '',
      '',
    ]);

    targetRange.setFontSize(8).setNumberFormats(monthlyInfoFormats);
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
      addHeaderColumns(refinedYear, refinedMonth, column);
    }

    const monthlyInfoRange = getMonthlyInfoRange();
    writeMonthlyInfo(action, column, monthlyInfoRange);
    deleteMonthlyInfo(monthlyInfoRange);
  };

  return {
    updateMonthlyInfos,
  };
};
