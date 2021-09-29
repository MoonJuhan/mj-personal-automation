const sheetMonthlySummary = GSS.getSheetByName('월간 요약');

// 월간 잔고 설정
const balanceUpdate = (date) => {
  let { pinRow, pinColumn } = findAssetsPin();

  const assetsList = [];

  let assetType;

  while (
    sheetMonthlySummary.getRange(pinRow, pinColumn).getValue() != 'Finder 03'
  ) {
    if (sheetMonthlySummary.getRange(pinRow, pinColumn - 3).getValue())
      assetType = sheetMonthlySummary
        .getRange(pinRow, pinColumn - 3)
        .getValue();

    const findAsset = assetsList.find((el) => el.categoryName === assetType);

    const value = sheetMonthlySummary.getRange(pinRow, pinColumn).getValue();

    if (!findAsset) {
      assetsList.push({ categoryName: assetType, value });
    } else {
      findAsset.value += value;
    }

    sheetMonthlySummary
      .getRange(pinRow, pinColumn - 1)
      .setValue(sheetMonthlySummary.getRange(pinRow, pinColumn).getValue());
    pinRow++;
  }

  writeMonthlyData('Finder01', '수입', '자산', 1, assetsList, date);

  updateCreditBills();
};

const updateCreditBills = () => {
  const { pinRow, pinColumn } = findAssetsPin();

  const creditPinColumn = pinColumn + 2;

  const value = sheetMonthlySummary
    .getRange(pinRow, creditPinColumn)
    .getValue();

  const writePin = sheetMonthlySummary
    .createTextFinder('전월 카드 값')
    .findAll();

  sheetMonthlySummary
    .getRange(writePin[0].getRow() - 1, writePin[0].getColumn())
    .setValue(value);
};

const findAssetsPin = () => {
  const pinCell = sheetMonthlySummary.createTextFinder('자산').findAll();
  const pinRow = pinCell[0].getRow() + 3;
  const pinColumn = pinCell[0].getColumn() + 3;

  return { pinRow, pinColumn };
};
