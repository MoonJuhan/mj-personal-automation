const GSS = SpreadsheetApp.getActive();

// 월간 실행 함수
const monthlyFunc = () => {
  // 연월 확인
  const time = new Date();
  const month = time.getMonth();
  const year = time.getFullYear();

  // 연간 거래 작성 --
  yearlyUpdate(month);

  // 연간 자산 기록 --
  writeMyAsset(year, month);

  // 월간 잔고 설정
  balanceUpdate();

  // 월간 거래 내역 업데이트
  monthlyCopy(year, month);
};

// 일간 실행 함수
const dailyFunc = () => {
  // 상환금 작성
  writePayback();
};
