const [{ values: monthlyTransactionsDBDateValues }] =
  $input.first().json.valueRanges;

// 날짜 정보 추출 함수
const getDateInfo = (date) => {
  const localDate = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const [year, month, day] = localDate.split(". ");
  return { year, month, day };
};

// 열 번호를 엑셀 열 문자로 변환
const numberToCol = (num) => {
  let col = "";
  while (num > 0) {
    const remainder = (num - 1) % 26;
    col = String.fromCharCode(remainder + 65) + col;
    num = Math.floor((num - remainder) / 26);
  }
  return col;
};

// 현재 날짜 정보
const { year, month } = getDateInfo(new Date());

// 월요일 날짜 정보
const weekStartDate = new Date();
weekStartDate.setDate(weekStartDate.getDate() - 6);
const { year: weekStartYear, month: weekStartMonth } =
  getDateInfo(weekStartDate);

// 월요일 날짜가 전월인지 확인
const isLastWeekInPreviousMonth =
  weekStartMonth !== month || weekStartYear !== year;

// 월간 거래 DB 범위 계산
const prevMonthStartColIndex = monthlyTransactionsDBDateValues[0].length;
const monthlyTransactionsDBRange = `월간 거래 DB!${numberToCol(
  prevMonthStartColIndex
)}:${numberToCol(prevMonthStartColIndex + 5)}`;

// 결과 반환
return {
  isLastWeekInPreviousMonth,
  monthlyTransactionsDBRange,
};
