const sheet_MonthlyList = GSS.getSheetByName('월간 거래');

// -----------------------

// 월간 거래 내역 복사
const monthlyCopy = (_year, _month) => {
  const mListPinCell = sheet_MonthlyList.createTextFinder('Finder01').findAll();

  const range = getListRange(
    sheet_MonthlyList,
    mListPinCell[0].getRow() + 2,
    mListPinCell[0].getColumn()
  );

  const sheet_YearlyList = GSS.getSheetByName(
    String(_year).slice(2, 4) + '년 월간 거래'
  );

  const yListPinCell = sheet_YearlyList
    .createTextFinder(_month == 0 ? '12월 거래' : _month + '월 거래')
    .findAll();

  range.copyTo(
    getListRange(
      sheet_YearlyList,
      yListPinCell[0].getRow() + 4,
      yListPinCell[0].getColumn()
    )
  );

  monthlyDelete(range);
};

// Range 가져오기
const getListRange = (sheet, row, col) => {
  const lastRow = sheet_MonthlyList.getLastRow();
  return sheet.getRange(row, col, lastRow, 12);
};

// 월간 거래 내역 삭제
const monthlyDelete = (_range) => {
  _range.clear({ contentsOnly: true });
};
