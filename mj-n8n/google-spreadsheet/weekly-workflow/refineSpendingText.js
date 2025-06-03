const [monthlyTransactionsSpendingValues, monthlyTransactionsDBSpendingValues] =
  $input.all().map((item) => {
    if (!item.json.valueRanges) return [];
    return item.json.valueRanges[0].values;
  });

// 날짜 정보 추출 함수
const getDateInfo = (date) => {
  const localDate = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const [year, month, day] = localDate.split(". ");
  return { year, month, day };
};

const getRowDateInfo = (text) => {
  const [rowMonth, rowDay] = text
    .split("월")
    .map((item) => item.replace("일", "").trim());

  return { rowMonth, rowDay };
};

const getFilteredDatas = (data, [startMonth, startDay], [endMonth, endDay]) =>
  data.filter((row) => {
    if (row[4].includes("이체")) return false;

    const { rowMonth, rowDay } = getRowDateInfo(row[0]);
    const isSameMonth = rowMonth === startMonth && rowMonth === endMonth;
    const isAfterStartDay = Number(rowDay) >= Number(startDay);
    const isBeforeEndDay = Number(rowDay) <= Number(endDay);

    // 시작 월과 종료 월이 같은 경우
    if (isSameMonth) {
      return isAfterStartDay && isBeforeEndDay;
    }

    // 시작 월과 종료 월이 다른 경우
    if (rowMonth === startMonth && rowMonth !== endMonth) {
      return isAfterStartDay;
    }

    if (rowMonth !== startMonth && rowMonth === endMonth) {
      return isBeforeEndDay;
    }

    return false;
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
    return `${rowYear}-${rowMonth}-${rowDay} 내역:${description} 금액:${amount} 카테고리:${category}`;
  }
);

return {
  spendingText: spendingTexts.join("\n"),
};
