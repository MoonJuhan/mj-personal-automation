var GSS = SpreadsheetApp.getActive();
var sheet_Monthly = GSS.getSheetByName("월간 요약");
var sheet_MonthlyList = GSS.getSheetByName("월간 거래");
var sheet_Yearly = GSS.getSheetByName("연간 요약");
var sheet_Calendar = GSS.getSheetByName("일간 소비 기록");
var sheet_Payback = GSS.getSheetByName("상환금");
var sheet_MyAsset = GSS.getSheetByName("연간 자산 기록");

// 월간 실행 함수
function monthlyFunc() {
  // 연월 확인
  var time = new Date();
  var month = time.getMonth();
  var year = time.getFullYear();

  // 연간 거래 작성
  yearlyUpdate(month);

  // 연간 자산 기록
  writeMyAsset(year, month);

  // 월간 잔고 설정
  balanceUpdate();

  // 월간 거래 내역 업데이트
  monthlyCopy(year, month);
}

// 일간 실행 함수
function dailyFunc() {
  // 상환금 작성
  writePayback();
}
