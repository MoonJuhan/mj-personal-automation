const [{ values: monthlyTransactionsSpendingValues }, { values: monthlyTransactionsIncomeValues }] =
  $input.first().json.valueRanges;

const spendingValues = monthlyTransactionsSpendingValues.filter((line) => line.length > 0);
const incomeValues = monthlyTransactionsIncomeValues.filter((line) => line.length > 0);

const START_ROW = 5;

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

const diffMonth = (year - 2019) * 12 + month - 5;

const numberToCol = (num) => {
  let col = '';
  while (num > 0) {
    const remainder = (num - 1) % 26;
    col = String.fromCharCode(remainder + 65) + col;
    num = Math.floor((num - remainder) / 26);
  }
  return col;
};

const startColIndex = diffMonth * 13 + 2;
const startCol = numberToCol(startColIndex);

return {
  valueInputOption: 'RAW',
  data: [
    {
      range: `월간 거래 DB!${startCol}${START_ROW - 2}:${startCol}${START_ROW - 1}`,
      majorDimension: 'ROWS',
      values: [[year], [month]],
    },
    {
      range: `월간 거래 DB!${startCol}${START_ROW}:${numberToCol(startColIndex + 5)}${spendingValues.length + START_ROW + 2}`,
      majorDimension: 'ROWS',
      values: spendingValues,
    },
    {
      range: `월간 거래 DB!${numberToCol(startColIndex + 7)}${START_ROW}:${numberToCol(startColIndex + 11)}${incomeValues.length + START_ROW + 2}`,
      majorDimension: 'ROWS',
      values: incomeValues,
    },
  ],
};
