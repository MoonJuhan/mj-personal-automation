const GSS = SpreadsheetApp.getActive();

// 월간 실행 함수
const monthlyFunc = () => {
  // 연월 확인
  const time = new Date();
  const month = time.getMonth();
  const year = time.getFullYear();

  // 연간 자산 데이터베이스 작성
  manageYearlyAssetsDB({ year, month });

  // 월간 잔고 설정
  balanceUpdate({ year, month });

  // 월간 거래 내역 업데이트
  monthlyCopy(year, month);

  console.log('Monthly Function is Over');
};

// 일간 실행 함수
const dailyFunc = () => {
  // 상환금 작성
  writePayback();
};
