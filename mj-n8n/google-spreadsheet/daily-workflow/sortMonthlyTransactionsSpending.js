const [_, { values: monthlyTransactionsSpendingValues }] =
  $input.first().json.valueRanges;

const transactionRows = [...monthlyTransactionsSpendingValues].slice(4);

const parseDay = (dateString) => {
  const trimmedDate = dateString.trim();

  const [_, day] = trimmedDate
    .replace("일", "")
    .split("월 ")
    .map((s) => parseInt(s, 10));

  return day;
};

const sortedTransactions = [...transactionRows].sort((a, b) => {
  const dateA = a[0].trim() ? parseDay(a[0]) : null;
  const dateB = b[0].trim() ? parseDay(b[0]) : null;

  if (!dateA && !dateB) return 0; // 둘 다 날짜가 비어있으면 순서 유지
  if (!dateA) return 1; // A의 날짜가 비어있으면 B보다 뒤로
  if (!dateB) return -1; // B의 날짜가 비어있으면 A보다 뒤로

  return dateA - dateB; // 둘 다 날짜가 있으면 일반적인 날짜 비교
});

const isSorted = transactionRows.every(
  (row, index) => parseDay(row[0]) === parseDay(sortedTransactions[index][0])
);

return {
  isSorted,
  sortedTransactionsValues: sortedTransactions,
  sortedTransactionsRange: `월간 거래!B5:G${sortedTransactions.length + 4}`,
};
