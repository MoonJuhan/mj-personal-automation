const sheetHome = GSS.getSheetByName('스마트홈');

const writeDHTSensor = ({ humidity, temperature }) => {
  const pinCell = sheetHome.createTextFinder('DHT22').findAll();
  let pinRow = pinCell[0].getRow() + 3;
  const pinColumn = pinCell[0].getColumn();

  while (sheetHome.getRange(pinRow, pinColumn).getValue()) {
    pinRow++;
  }
  pinRow--;


  const time = new Date();

  sheetHome.getRange(pinRow, pinColumn).setValue(time)
  sheetHome.getRange(pinRow, pinColumn + 1).setValue(time)
  sheetHome.getRange(pinRow, pinColumn + 2).setValue(temperature)
  sheetHome.getRange(pinRow, pinColumn + 3).setValue(humidity)
  
};
