const GSS = SpreadsheetApp.getActive();

// 월간 실행 함수
const monthlyFunc = () => {
  // 연월 확인
  // 스크립트가 작동하는 시점은 다음 달 임을 주의해야함
  const time = new Date();
  // const month = time.getMonth();
  // const year = time.getFullYear();

  const month = 0;
  const year = 2023;

  // console.log('연간 자산 데이터베이스 작성');
  // const { manageYearlyAssetsDB } = useManageAssetsDB();
  // manageYearlyAssetsDB({ year, month });

  // console.log('월간 잔고 설정');
  // balanceUpdate({ year, month });

  console.log('월간 거래 내역 업데이트');
  const { updateMonthlyInfos } = useMonthlyInfosDB();
  updateMonthlyInfos({ year, month });
};
