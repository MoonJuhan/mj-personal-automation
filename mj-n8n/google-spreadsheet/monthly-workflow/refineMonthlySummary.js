const [
  { values: spendingsByCategoryValues },
  { values: incomesByCategoryValues },
] = $input.first().json.valueRanges;

const getSpendingsByCategory = () => {
  const spendingsByCategory = spendingsByCategoryValues
    .map((line) => {
      if (line.length !== 3 || !line[0]) return null;
      return {
        category: line[0],
        amount: line[2],
      };
    })
    .filter(Boolean);

  return { spendingsByCategory };
};

const getIncomesByCategory = () => {
  const incomesByCategory = [];
  for (const line of incomesByCategoryValues) {
    incomesByCategory.push({
      category: line[1],
      amount: line[3],
    });

    if (line.length === 0) {
      return { incomesByCategory };
    }
  }

  return { incomesByCategory };
};

const getAccountBalanceDatas = () => {
  const accountTypeBalances = [];
  const accountBalances = [];

  let accountBalanceTrigger = false;
  let accountType = "";
  let accountAmount = 0;

  let startRow = -1;

  const addAccountBalance = (accountType, accountAmount) => {
    if (!accountType) return;

    accountTypeBalances.push({
      accountType,
      amount: accountAmount,
    });
  };

  for (let i = 0; i < incomesByCategoryValues.length; i += 1) {
    const line = incomesByCategoryValues[i];
    if (line.length > 0 && line[0] === "자산" && !accountBalanceTrigger) {
      accountBalanceTrigger = true;
      startRow = i + 23;
    }

    if (line.length === 0 && accountBalanceTrigger) {
      accountBalanceTrigger = false;
      addAccountBalance(accountType, accountAmount);
    }

    if (accountBalanceTrigger) {
      if (line[0] && !["자산", "합계"].includes(line[0])) {
        addAccountBalance(accountType, accountAmount);

        accountType = line[0];
        accountAmount = 0;
      }

      if (accountType) {
        accountBalances.push({
          name: line[1],
          amount: line[3],
        });
        accountAmount += parseInt(line[3].replace(/[₩,]/g, ""), 10);
      }
    }
  }

  return {
    accountTypeBalances,
    accountBalances,
    accountBalanceStartRow: startRow,
  };
};

return {
  ...getSpendingsByCategory(),
  ...getIncomesByCategory(),
  ...getAccountBalanceDatas(),
};
