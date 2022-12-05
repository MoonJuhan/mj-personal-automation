const GSS = SpreadsheetApp.getActive();

// 스크립트가 작동하는 시점은 다음 달 임을 주의해야함

const monthlyFunc = () => {
  const time = new Date();
  const month = time.getMonth();
  const year = time.getFullYear();

  // const { manageYearlyAssetsDB } = useManageAssetsDB();
  // manageYearlyAssetsDB({ year, month });

  balanceUpdate({ year, month });

  // const { updateMonthlyInfos } = useMonthlyInfosDB();
  // updateMonthlyInfos({ year, month });
};
