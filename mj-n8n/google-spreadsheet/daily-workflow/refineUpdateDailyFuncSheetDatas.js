const [
  { values: periodicTransactionsValues },
  { values: monthlyTransactionsSpendingValues },
  { values: monthlyTransactionsIncomeValues },
] = $input.first().json.valueRanges;

// 현재 날짜 정보 계산
const date = new Date();
const localDate = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
const [year, month, day] = localDate.split(". ");

const formattedDate = `${year}. ${month.padStart(2, "0")}. ${day.padStart(
  2,
  "0"
)}`;

// 헬퍼 함수: 안전하게 행 데이터 추출
const getLineData = (line, index) => (line.length >= index ? line[index] : "");

const spendingValues = [];
const incomeValues = [];

// 거래 내역 데이터 처리: 현재 날짜와 일치하는 행만 처리
periodicTransactionsValues.forEach((line) => {
  if (!line.length || String(line[0]) !== day) return;

  const amount = getLineData(line, 2);
  const detail = getLineData(line, 3);
  const category = getLineData(line, 4);
  const paymentMethod = getLineData(line, 5);

  // 거래 유형에 따라 데이터를 분리
  if (line[1] === "지출") {
    spendingValues.push([
      formattedDate,
      amount,
      detail,
      amount,
      category,
      paymentMethod,
    ]);
  } else {
    incomeValues.push([formattedDate, amount, detail, category, paymentMethod]);
  }
});

// "월간 거래" 시트 업데이트 범위 계산: 시작 행과 종료 행을 명확하게 구분
const spendingStartRow = monthlyTransactionsSpendingValues.length + 1;
const spendingEndRow = spendingStartRow + spendingValues.length - 1;
const spendingRange = `월간 거래!B${spendingStartRow}:G${spendingEndRow}`;

const incomeStartRow = monthlyTransactionsIncomeValues.length + 1;
const incomeEndRow = incomeStartRow + incomeValues.length - 1;
const incomeRange = `월간 거래!I${incomeStartRow}:M${incomeEndRow}`;

return { spendingValues, spendingRange, incomeValues, incomeRange };
