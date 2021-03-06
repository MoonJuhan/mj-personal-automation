const T_GSS = SpreadsheetApp.openById('Spreadsheet ID');
const sheetPublicRentalHouse = T_GSS.getSheetByName('PublicRentalHouse');

const findSubscriptionPin = (chatId) => {
  const pinCell = sheetPublicRentalHouse.createTextFinder(chatId).findAll();
  if (pinCell.length === 0) {
    return { error: true };
  } else {
    const pinRow = pinCell[0].getRow();
    const pinColumn = pinCell[0].getColumn();

    return { pinRow, pinColumn };
  }
};

const getSubscription = ({ chatId }) => {
  const { pinRow, pinColumn, error } = findSubscriptionPin(chatId);

  if (error) {
    return {
      msg: `당신의 Chat Id는 ${chatId}입니다.\n해당 Chat Id로 구독을 하고 있지 않습니다.`,
    };
  } else {
    const filters = sheetPublicRentalHouse
      .getRange(pinRow, pinColumn + 1)
      .getValue();

    return {
      msg: `당신의 Chat Id는 ${chatId}입니다.\n당신이 선택한 경기도 필터는 ${filters}입니다.`,
    };
  }
};

const editSubscription = ({ chatId, filters }) => {
  const { pinRow } = findSubscriptionPin(chatId);

  if (pinRow) {
    writeSubscription(pinRow, chatId, filters);
    return { msg: '알림 구독이 수정되었습니다.' };
  } else {
    const lastRow = sheetPublicRentalHouse.getLastRow();
    sheetPublicRentalHouse.insertRowAfter(lastRow);
    writeSubscription(lastRow + 1, chatId, filters);
    return { msg: '알림 구독이 신청되었습니다.' };
  }
};

const writeSubscription = (row, chatId, filters) => {
  sheetPublicRentalHouse.getRange(row, 2).setValue(chatId);
  sheetPublicRentalHouse.getRange(row, 3).setValue(filters);
};

const deleteSubscription = ({ chatId }) => {
  const { pinRow, error } = findSubscriptionPin(chatId);

  if (!error) {
    sheetPublicRentalHouse.deleteRow(pinRow);

    return { msg: '알림 구독이 취소되었습니다.' };
  } else {
    return {
      msg: `당신의 Chat Id는 ${chatId}입니다.\n해당 Chat Id로 구독을 하고 있지 않습니다.`,
    };
  }
};
