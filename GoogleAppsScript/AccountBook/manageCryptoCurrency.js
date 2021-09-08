const sheetCryptoCurrency = GSS.getSheetByName('암호화폐 투자 정리');

const updateCryptoCurrency = () => {
  const pinCell = sheetCryptoCurrency.createTextFinder('Ticker').findAll();
  let pinRow = pinCell[0].getRow() + 1;
  const pinColumn = pinCell[0].getColumn();
  while (sheetCryptoCurrency.getRange(pinRow, pinColumn).getValue()) {
    const code = sheetCryptoCurrency.getRange(pinRow, pinColumn).getValue();
    sheetCryptoCurrency
      .getRange(pinRow, pinColumn + 2)
      .setValue(getCryptoCurrency(code));
    pinRow++;
  }
};

const getCryptoCurrency = (code) => {
  const json = UrlFetchApp.fetch(getUrl(code)).getContentText();
  const data = JSON.parse(json);

  return data[0].tradePrice;
};

const getUrl = (code) => {
  return (
    'https://crix-api-endpoint.upbit.com/v1/crix/candles/days?code=CRIX.UPBIT.KRW-' +
    code +
    '&count=1'
  );
};
