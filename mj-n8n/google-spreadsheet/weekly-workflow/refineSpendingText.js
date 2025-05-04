const [monthlyTransactionsSpendingValues, monthlyTransactionsDBSpendingValues] =
  $input.all().map((item) => item.json.valueRanges[0].values);

// 날짜 정보 추출 함수
const getDateInfo = (date) => {
  const localDate = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const [year, month, day] = localDate.split(". ");
  return { year, month, day };
};

const getRowDateInfo = (text) => {
  const [rowMonth, rowDay] = text
    .trim()
    .split("월")
    .map((item) => item.replace("일", ""));

  return { rowMonth, rowDay };
};

const getFilteredDatas = (data, [startMonth, startDay], [endMonth, endDay]) =>
  data.filter((row) => {
    const { rowMonth, rowDay } = getRowDateInfo(row[0]);

    return (
      (rowMonth === startMonth && Number(rowDay) >= Number(startDay)) ||
      (rowMonth === endMonth && Number(rowDay) <= Number(endDay))
    );
  });

// 현재 날짜 정보
const { year, month, day } = getDateInfo(new Date());

// 월요일 날짜 정보
const weekStartDate = new Date();
weekStartDate.setDate(weekStartDate.getDate() - 6);
const {
  year: weekStartYear,
  month: weekStartMonth,
  day: weekStartDay,
} = getDateInfo(weekStartDate);

const spendingDatas = [
  ...getFilteredDatas(
    monthlyTransactionsDBSpendingValues.slice(6),
    [weekStartMonth, weekStartDay],
    [month, day]
  ),
  ...getFilteredDatas(
    monthlyTransactionsSpendingValues.slice(4),
    [weekStartMonth, weekStartDay],
    [month, day]
  ),
];

const spendingTexts = spendingDatas.map(
  ([date, _, description, amount, category, paymentMethod]) => {
    const { rowMonth, rowDay } = getRowDateInfo(date);
    const rowYear = rowMonth === month ? year : weekStartYear;
    return `${rowYear}-${rowMonth}-${rowDay} 내역:${description} 금액:${amount} 카테고리:${category} 결제수단:${paymentMethod}`;
  }
);

return { spendingText: spendingTexts.join("\n") };
