const [
  { values: periodicTransactionsValues },
  { values: monthlyTransactionsSpendingValues },
  { values: monthlyTransactionsIncomeValues },
] = $input.first().json.valueRanges;

const now = new Date();
const today = now.getDate();

const spendingValues = [];
const incomeValues = [];

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}. ${mm}. ${dd}`;
};

const getLineData = (line, index) => {
  if (line.length < index) return "";
  return line[index];
};

periodicTransactionsValues.forEach((line) => {
  if (line.length === 0 || String(line[0]) !== String(today)) return;

  const date = formatDate(now);
  const amount = getLineData(line, 2);
  const detail = getLineData(line, 3);
  const category = getLineData(line, 4);
  const paymentMethod = getLineData(line, 5);

  if (line[1] === "지출") {
    spendingValues.push([
      date,
      amount,
      detail,
      amount,
      category,
      paymentMethod,
    ]);
  } else {
    incomeValues.push([date, amount, detail, category, paymentMethod]);
  }
});

const spendingLastRow = monthlyTransactionsSpendingValues.length + 1;
const spendingRange = `월간 거래!B${spendingLastRow}:G${
  spendingLastRow - 1 + spendingValues.length
}`;

const incomeLastRow = monthlyTransactionsIncomeValues.length + 1;
const incomeRange = `월간 거래!I${incomeLastRow}:M${
  incomeLastRow - 1 + incomeValues.length
}`;

return { spendingValues, spendingRange, incomeValues, incomeRange, today };
