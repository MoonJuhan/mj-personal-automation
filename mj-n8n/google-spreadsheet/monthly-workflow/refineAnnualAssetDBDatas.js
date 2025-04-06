const [
  { values: annualAssetDBCategoriesValues },
  { values: annualAssetDBLastRowValues },
] = $input.first().json.valueRanges;

const getCategoryCellInfos = () => {
  const assetCategories = [];

  const getCol = (index) => {
    const firstCol = "I";
    const baseCode = firstCol.charCodeAt(0) - 65;
    let newCode = baseCode + index - 1;

    let result = "";
    while (newCode >= 26) {
      result += String.fromCharCode(65 + Math.floor(newCode / 26) - 1);
      newCode = newCode % 26;
    }

    result += String.fromCharCode(65 + newCode);

    return result;
  };

  const [assetCategoriesLine, incomeCategoriesLine, spendingCategoriesLine] =
    annualAssetDBCategoriesValues;

  assetCategoriesLine.slice(0, 5).forEach((value, index) => {
    assetCategories.push({
      category: value,
      col: getCol(index + 1),
    });
  });

  const incomeCategories = incomeCategoriesLine
    .map((value, index) => ({
      category: value,
      col: getCol(index + 1),
    }))
    .filter(({ category }) => category && category.includes("-"));

  const spendingCategories = spendingCategoriesLine
    .map((value, index) => ({
      category: value,
      col: getCol(index + 1),
    }))
    .filter(({ category }) => category);

  return { assetCategories, incomeCategories, spendingCategories };
};

const getLastRow = () => {
  const now = new Date();
  const year = now.getFullYear();
  // 스크립트가 실행되는 월이 다음 월이라 1을 더하지 않음
  const month = now.getMonth();

  let lastRow = 0;
  annualAssetDBLastRowValues.forEach((line, index) => {
    if (
      line.length === 2 &&
      line[0] === String(year) &&
      line[1] === String(month)
    ) {
      lastRow = index + 1;
    }
  });

  return { targetRow: lastRow };
};

return { ...getCategoryCellInfos(), ...getLastRow() };
