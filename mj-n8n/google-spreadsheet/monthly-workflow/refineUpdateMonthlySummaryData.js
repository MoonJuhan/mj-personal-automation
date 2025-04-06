const { accountBalances, accountBalanceStartRow } = $input.first().json;

const range = `월간 요약!L34:L${
  accountBalanceStartRow + accountBalances.length - 1
}`;
const rangeValue = [accountBalances.map(({ amount }) => amount)];

return { range, rangeValue };
