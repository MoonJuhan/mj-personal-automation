const GSS = SpreadsheetApp.getActive()
const sheetMonthlyInfosDB = GSS.getSheetByName('월간 거래 DB')

// 스크립트가 작동하는 시점은 다음 달 임을 주의해야함
const monthlyFunc = () => {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth()

  updateMonthlyInfos({ year, month })
}

const updateMonthlyInfos = ({ year, month }) => {
  const monthlyInfosHeaders = [{ format: 'm월 d일', width: 100 }, { format: '₩0,000' }, { format: '' }, { format: '₩0,000' }, { format: '₩0,000' }, { format: '' }, { format: '', width: 30 }]
  const columnLength = monthlyInfosHeaders.length

  sheetMonthlyInfosDB.insertColumnsAfter(1, columnLength)

  sheetMonthlyInfosDB.getRange(2, columnLength + 2, 7, columnLength).copyTo(sheetMonthlyInfosDB.getRange(2, 2, 7, columnLength))

  sheetMonthlyInfosDB.getRange(6, 2).setValue(`${year}년 ${month + 1}월`)

  sheetMonthlyInfosDB.getRange(2, columnLength + 2, 3, columnLength).clear({ contentsOnly: true })

  const sheetLastRow = sheetMonthlyInfosDB.getLastRow()

  const monthlyInfoFormats = new Array(sheetLastRow).fill(monthlyInfosHeaders.map(({ format }) => format))

  sheetMonthlyInfosDB
    .getRange(9, 2, sheetLastRow, columnLength)
    .setFontSize(10)
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle')
    .setFontFamily('Lato')
    .setFontColor('#334960')
    .setNumberFormats(monthlyInfoFormats)

  monthlyInfosHeaders.forEach(({ width }, index) => {
    sheetMonthlyInfosDB.setColumnWidths(index + 2, 1, width || 120)
  })
}
