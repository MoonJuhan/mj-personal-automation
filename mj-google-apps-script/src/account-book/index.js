const GSS = SpreadsheetApp.getActive()

// 스크립트가 작동하는 시점은 다음 달 임을 주의해야함
const monthlyFunc = () => {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth()

  const { updateYearlyAssetsDB } = useManageAssetsDB()
  updateYearlyAssetsDB({ year, month })

  const { updateMonthlySummary } = useManageMonthlySummary()
  updateMonthlySummary({ year, month })

  const { updateMonthlyInfos } = useManageMonthlyInfosDB()
  updateMonthlyInfos({ year, month })
}
