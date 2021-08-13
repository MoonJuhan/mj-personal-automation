const sheetHome = GSS.getSheetByName('스마트홈');

const writeDHTSensor = ({ humidity, temperature }) => {
  const pinCell = sheetHome.createTextFinder('DHT22').findAll();
  let pinRow = sheetHome.getLastRow() + 1;
  const pinColumn = pinCell[0].getColumn();

  sheetHome.insertRowAfter(sheetHome.getLastRow());

  console.log(
    pinRow,
    pinColumn,
    sheetHome.getRange(pinRow, pinColumn).getValue()
  );

  const time = new Date();
  console.log(time);
  console.log(humidity, temperature);
  sheetHome.getRange(pinRow, pinColumn).setValue(time);
  sheetHome.getRange(pinRow, pinColumn + 1).setValue(time);
  sheetHome.getRange(pinRow, pinColumn + 2).setValue(temperature);
  sheetHome.getRange(pinRow, pinColumn + 3).setValue(humidity);
};
