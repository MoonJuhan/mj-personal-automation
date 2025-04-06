const [
  { values: speindingTransactionsValues },
  { values: incomeTransactionsValues },
] = $("getMonthlyTransactionsSheetDatas").first().json.valueRanges;
const rowLength = Math.max(
  speindingTransactionsValues.length - 4,
  incomeTransactionsValues.length - 4
);

const range = `월간 거래!B5:M${rowLength + 4}`;

const rangeValue = new Array(rowLength).fill(0).map((_, i) => {
  return new Array(12).fill(0).map((_, j) => {
    if (j === 3) return `=C${i + 5}`;
    return "";
  });
});

return { range, rangeValue };
