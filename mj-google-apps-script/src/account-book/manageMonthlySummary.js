const sheetMonthlySummary = GSS.getSheetByName('월간 요약')

const useManageMonthlySummary = () => {
  const { getValueWithPosition, findPositionWithText, writeData } = useHelpers()

  const updateCreditBills = () => {
    const nowMonthCreditBillPos = findPositionWithText(sheetMonthlySummary, '당월 카드 값')

    const nowCreditBill = getValueWithPosition(sheetMonthlySummary, nowMonthCreditBillPos.pinRow - 1, nowMonthCreditBillPos.pinColumn)

    const { pinRow, pinColumn } = findPositionWithText(sheetMonthlySummary, '전월 카드 값')

    writeData(sheetMonthlySummary, pinRow - 1, pinColumn, nowCreditBill)
  }

  const updateLastMonthBalance = () => {
    const { pinRow, pinColumn } = findPositionWithText(sheetMonthlySummary, '자산')

    const assetsList = []

    let category

    const finter03Pos = findPositionWithText(sheetMonthlySummary, 'Finder 03')

    for (let row = pinRow + 3; row < finter03Pos.pinRow; row++) {
      const targetCategory = getValueWithPosition(sheetMonthlySummary, row, pinColumn)

      if (targetCategory) {
        category = targetCategory
      }

      const value = getValueWithPosition(sheetMonthlySummary, row, pinColumn + 3)

      const findAsset = assetsList.find((el) => el.category === category)

      if (!findAsset) {
        assetsList.push({ category, value })
      } else {
        findAsset.value += value
      }

      writeData(sheetMonthlySummary, row, pinColumn + 2, sheetMonthlySummary.getRange(row, pinColumn + 3).getValue())
    }

    return assetsList
  }

  const updateMonthlySummary = (date) => {
    updateCreditBills()

    const assetsList = updateLastMonthBalance()

    const { writeMonthlyData } = useManageAssetsDB()

    writeMonthlyData('Finder01', '수입', '자산', 1, assetsList, date)
  }

  return { updateMonthlySummary }
}
