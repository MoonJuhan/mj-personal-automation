const sheet_Monthly = GSS.getSheetByName("월간 요약");
const sheet_MonthlyList = GSS.getSheetByName("월간 거래");
const sheet_Yearly = GSS.getSheetByName("연간 요약");
const sheet_Calendar = GSS.getSheetByName("일간 소비 기록");
const sheet_MyAsset = GSS.getSheetByName("연간 자산 기록");

// 월간 잔고 설정
const balanceUpdate = () => {
  const pinCell = sheet_Monthly.createTextFinder("자산").findAll();
  const pinRow = pinCell[0].getRow() + 3;
  const pinColumn = pinCell[0].getColumn() + 3;

  while (sheet_Monthly.getRange(pinRow, pinColumn).getValue() != "Finder 03") {
    sheet_Monthly
      .getRange(pinRow, pinColumn - 1)
      .setValue(sheet_Monthly.getRange(pinRow, pinColumn).getValue());
    pinRow++;
  }
};

// -----------------------

// 연간 거래 작성
const yearlyUpdate = (_month) => {
  // 지출 찾기
  const expenseArray = findMonthly("01");

  // 지출 작성
  writeYearly("01", expenseArray, _month);

  // 수입 찾기
  const incomeArray = findMonthly("02");

  // 수입 작성
  writeYearly("02", incomeArray, _month);
};

// 월간 요약 찾기
const findMonthly = (_code) => {
  const pinCell = sheet_Monthly.createTextFinder("Finder" + _code).findAll();
  let pinRow = pinCell[0].getRow() + 1;
  const pinColumn = pinCell[0].getColumn();

  const returnArray = [];

  while (sheet_Monthly.getRange(pinRow, pinColumn).getValue() != "") {
    returnArray.push({
      name: sheet_Monthly.getRange(pinRow, pinColumn).getValue(),
      num: sheet_Monthly.getRange(pinRow, pinColumn + 3).getValue(),
    });
    pinRow++;
  }

  return returnArray;
};

// 연간 요약 작성
const writeYearly = (_code, _array, _month) => {
  let month = _month;
  if (month == 0) {
    month = 12;
  }
  const pinCell = sheet_Yearly.createTextFinder("Finder" + _code).findAll();
  let pinRow = pinCell[0].getRow() + 1;
  const pinColumn = pinCell[0].getColumn();

  while (sheet_Yearly.getRange(pinRow, pinColumn).getValue() != "End" + _code) {
    if (
      sheet_Yearly.getRange(pinRow, pinColumn).getValue() != "" &&
      sheet_Yearly.getRange(pinRow, pinColumn).getValue() != "월간 합계:"
    ) {
      for (let i in _array) {
        if (
          sheet_Yearly.getRange(pinRow, pinColumn).getValue() == _array[i].name
        ) {
          sheet_Yearly
            .getRange(pinRow, pinColumn + month)
            .setValue(_array[i].num);
          _array.splice(i, 1);
          break;
        }
      }
    }
    pinRow++;
  }
};

// -----------------------

// 월간 거래 내역 복사
const monthlyCopy = (_year, _month) => {
  const mListPinCell = sheet_MonthlyList.createTextFinder("Finder01").findAll();

  const range = getListRange(
    sheet_MonthlyList,
    mListPinCell[0].getRow() + 2,
    mListPinCell[0].getColumn()
  );

  const sheet_YearlyList = GSS.getSheetByName(
    String(_year).slice(2, 4) + "년 월간 거래"
  );

  const yListPinCell = sheet_YearlyList
    .createTextFinder(_month == 0 ? "12월 거래" : _month + "월 거래")
    .findAll();

  range.copyTo(
    getListRange(
      sheet_YearlyList,
      yListPinCell[0].getRow() + 4,
      yListPinCell[0].getColumn()
    )
  );

  monthlyDelete(range);
};

// Range 가져오기
const getListRange = (sheet, row, col) => {
  const lastRow = sheet_MonthlyList.getLastRow();
  return sheet.getRange(row, col, lastRow, 12);
};

// 월간 거래 내역 삭제
const monthlyDelete = (_range) => {
  _range.clear({ contentsOnly: true });
};

// -----------------------

// 연간 자산 기록 함수
const writeMyAsset = (_year, _month) => {
  // 2021 05
  console.log(_year, _month);

  let pinCell = sheet_Monthly.createTextFinder("자산").findAll();
  let pinRow = pinCell[0].getRow() + 3;
  const pinColumn = pinCell[0].getColumn() + 3;

  let accountList = [0, 0, 0, 0];
  let monthlyAssetList = [];

  while (sheet_Monthly.getRange(pinRow, pinColumn).getValue() != "Finder 03") {
    const price = sheet_Monthly.getRange(pinRow, pinColumn).getValue();
    const name = sheet_Monthly.getRange(pinRow, pinColumn - 3).getValue();

    if (name == "KB증권 CMA" || name == "주식 투자금") {
      accountList[3] += price;
    } else if (name == "IBK 주택청약통장") {
      accountList[2] += price;
    } else if (name == "사이다뱅크") {
      accountList[1] += price;
    } else {
      accountList[0] += price;
    }

    pinRow++;
  }

  monthlyAssetList.push({
    name: "일반 계좌",
    num: accountList[0],
  });
  monthlyAssetList.push({
    name: "저축 계좌",
    num: accountList[1],
  });
  monthlyAssetList.push({
    name: "청약 계좌",
    num: accountList[2],
  });
  monthlyAssetList.push({
    name: "투자 자금",
    num: accountList[3],
  });

  const yearFinder = sheet_MyAsset
    .createTextFinder(_year)
    .findAll()
    .filter(
      (el) =>
        el.getColumn() == 2 &&
        sheet_MyAsset.getRange(el.getRow(), el.getColumn() + 1).getValue() ==
          _month
    );

  const writePinRow = yearFinder[0].getRow();

  let monthlyExpenseList = getMonthlyList("Finder01", _month);
  let monthlyIncomeList = getMonthlyList("Finder02", _month);
  console.log(monthlyExpenseList);

  monthlyAssetList.forEach((el) => {
    writeNum(el, writePinRow);
  });

  monthlyExpenseList.forEach((el) => {
    writeNum(el, writePinRow);
  });
  monthlyIncomeList.forEach((el) => {
    writeNum(el, writePinRow);
  });
};

const getMonthlyList = (type, _month) => {
  let textFinder = sheet_Yearly.createTextFinder(type).findAll()[0];
  let pinRow = textFinder.getRow();
  let returnList = [];
  const pinColumn = textFinder.getColumn();
  console.log(type, pinRow, pinColumn);

  while (
    sheet_Yearly.getRange(pinRow, pinColumn).getValue() !=
    type.replace("Finder", "End")
  ) {
    if (sheet_Yearly.getRange(pinRow, pinColumn).getValue() == "월간 합계:") {
      const name = sheet_Yearly.getRange(pinRow, pinColumn - 1).getValue();
      const num = sheet_Yearly.getRange(pinRow, pinColumn + _month).getValue();

      returnList.push({
        name,
        num,
      });
    }
    pinRow++;
  }

  return returnList;
};

const writeNum = (obj, row) => {
  sheet_MyAsset
    .getRange(
      row,
      sheet_MyAsset.createTextFinder(obj.name).findAll()[0].getColumn()
    )
    .setValue(obj.num);
};
