const START_COL = "I";

const colToNumber = (col) => {
  let num = 0;
  for (let i = 0; i < col.length; i++) {
    num *= 26;
    num += col.charCodeAt(i) - 64;
  }
  return num;
};

const numberToCol = (num) => {
  let col = "";
  while (num > 0) {
    const remainder = (num - 1) % 26;
    col = String.fromCharCode(remainder + 65) + col;
    num = Math.floor((num - remainder) / 26);
  }
  return col;
};

const getColDistance = (startCol, endCol) => {
  const startNum = colToNumber(startCol.toUpperCase());
  const endNum = colToNumber(endCol.toUpperCase());

  return Math.abs(endNum - startNum) + 1;
};

const getRangeData = () => {
  const { spendingCategories, targetRow } = $(
    "refineAnnualAssetDBDatas"
  ).first().json;

  const lastCol = spendingCategories[spendingCategories.length - 1].col;
  const range = `연간 자산 DB!${START_COL}${targetRow}:${lastCol}${targetRow}`;

  return { range, distance: getColDistance(START_COL, lastCol) };
};

const getRangeValue = (distance) => {
  const { assetCategories, incomeCategories, spendingCategories } = $(
    "refineAnnualAssetDBDatas"
  ).first().json;
  const { spendingsByCategory, incomesByCategory, accountTypeBalances } = $(
    "refineMonthlySummary"
  ).first().json;

  const getCellValue = (col) => {
    const { category } =
      [...assetCategories, ...incomeCategories, ...spendingCategories].find(
        ({ col: categoryCol }) => categoryCol === col
      ) || {};

    if (!category) return null;

    const { amount } =
      [
        ...spendingsByCategory,
        ...incomesByCategory,
        ...accountTypeBalances,
      ].find(
        ({ accountType, category: targetCategory }) =>
          accountType === category || targetCategory === category
      ) || {};

    if (amount === undefined) return null;

    return amount;
  };

  const rangeValue = new Array(distance).fill(0).map((_, i) => {
    const col = numberToCol(i + colToNumber(START_COL));
    return getCellValue(col);
  });

  return [rangeValue];
};

const { range, distance } = getRangeData();
const rangeValue = getRangeValue(distance);

return { range, rangeValue };
