//월간 잔고 설정
function balanceUpdate() {
  var pinCell = sheet_Monthly.createTextFinder("자산").findAll();
  var pinRow = pinCell[0].getRow() + 3;
  var pinColumn = pinCell[0].getColumn() + 3;

  while (sheet_Monthly.getRange(pinRow, pinColumn).getValue() != "Finder 03") {
    sheet_Monthly
      .getRange(pinRow, pinColumn - 1)
      .setValue(sheet_Monthly.getRange(pinRow, pinColumn).getValue());
    pinRow++;
  }
}

// -----------------------

// 연간 거래 작성
function yearlyUpdate(_month) {
  // 지출 찾기
  var expenseArray = findMonthly("01");

  // 지출 작성
  writeYearly("01", expenseArray, _month);

  // 수입 찾기
  var incomeArray = findMonthly("02");

  console.log(incomeArray);
  // 수입 작성
  writeYearly("02", incomeArray, _month);
}

// 월간 요약 찾기
function findMonthly(_code) {
  var findCode = "Finder" + _code;
  var pinCell = sheet_Monthly.createTextFinder(findCode).findAll();
  var pinRow = pinCell[0].getRow() + 1;
  var pinColumn = pinCell[0].getColumn();

  var returnArray = [];

  while (sheet_Monthly.getRange(pinRow, pinColumn).getValue() != "") {
    var Obj = {
      name: sheet_Monthly.getRange(pinRow, pinColumn).getValue(),
      num: sheet_Monthly.getRange(pinRow, pinColumn + 3).getValue(),
    };

    returnArray.push(Obj);
    pinRow++;
  }

  return returnArray;
}

// 연간 요약 작성
function writeYearly(_code, _array, _month) {
  var month = _month;
  if (month == 0) {
    month = 12;
  }
  var findCode = "Finder" + _code;
  var endCode = "End" + _code;
  var pinCell = sheet_Yearly.createTextFinder(findCode).findAll();
  var pinRow = pinCell[0].getRow() + 1;
  var pinColumn = pinCell[0].getColumn();

  while (sheet_Yearly.getRange(pinRow, pinColumn).getValue() != endCode) {
    if (
      sheet_Yearly.getRange(pinRow, pinColumn).getValue() != "" &&
      sheet_Yearly.getRange(pinRow, pinColumn).getValue() != "월간 합계:"
    ) {
      for (var i in _array) {
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
}

// -----------------------

//월간 거래 내역 복사
function monthlyCopy(_year, _month) {
  // 다음년 오류 발생
  var findSheet = String(_year).slice(2, 4) + "년 월간 거래";
  var findCode = _month + "월 거래";
  if (_month == 0) {
    findCode = "12월 거래";
  }

  var pinCell = sheet_MonthlyList.createTextFinder("Finder01").findAll();
  var pinRow = pinCell[0].getRow() + 2;
  var pinColumn = pinCell[0].getColumn();

  var range = sheet_MonthlyList.getRange(pinRow, pinColumn, 100, 12);

  console.log(findSheet);
  var sheet_YearlyList = GSS.getSheetByName(findSheet);
  pinCell = sheet_YearlyList.createTextFinder(findCode).findAll();
  pinRow = pinCell[0].getRow() + 4;
  pinColumn = pinCell[0].getColumn();

  range.copyTo(sheet_YearlyList.getRange(pinRow, pinColumn, 100, 12));

  monthlyDelete(range);
}
//월간 거래 내역 삭제
function monthlyDelete(_range) {
  _range.clear({ contentsOnly: true });
}

// -----------------------

// 연간 자산 기록 함수
function writeMyAsset(_year, _month) {
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

  let yearFinder = sheet_MyAsset
    .createTextFinder(_year)
    .findAll()
    .filter(
      (el) =>
        el.getColumn() == 2 &&
        sheet_MyAsset.getRange(el.getRow(), el.getColumn() + 1).getValue() ==
          _month
    );

  const writePinRow = yearFinder[0].getRow();

  let monthlyExpenseList = getMonthlyList("Finder01");
  let monthlyIncomeList = getMonthlyList("Finder02");

  monthlyAssetList.forEach((el) => {
    writeNum(el, writePinRow);
  });

  monthlyExpenseList.forEach((el) => {
    writeNum(el, writePinRow);
  });
  monthlyIncomeList.forEach((el) => {
    writeNum(el, writePinRow);
  });
}

const getMonthlyList = (type) => {
  let textFinder = sheet_Yearly.createTextFinder(type).findAll()[0];
  let pinRow = textFinder.getRow();
  let returnList = [];
  const pinColumn = textFinder.getColumn();

  while (
    sheet_Yearly.getRange(pinRow, pinColumn).getValue() !=
    type.replace("Finder", "End")
  ) {
    if (sheet_Yearly.getRange(pinRow, pinColumn).getValue() == "월간 합계:") {
      const name = sheet_Yearly.getRange(pinRow, pinColumn - 1).getValue();
      const num = sheet_Yearly.getRange(pinRow, pinColumn + 1).getValue();
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
  var col = sheet_MyAsset.createTextFinder(obj.name).findAll()[0].getColumn();
  sheet_MyAsset.getRange(row, col).setValue(obj.num);
};
