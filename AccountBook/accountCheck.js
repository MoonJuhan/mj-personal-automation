const accountGroups = [
  {
    name: '투자 자금',
    code: 'investment',
    codeNum: 3,
    accounts: ['KB증권 CMA', '주식 투자금'],
  },
  {
    name: '장기 저축 계좌',
    code: 'longTerm',
    codeNum: 2,
    accounts: ['IBK 주택청약통장', 'KB증권 개인연금'],
  },
  {
    name: '일반 저축 계좌',
    code: 'saving',
    codeNum: 1,
    accounts: ['사이다뱅크'],
  },
  {
    name: '일반 계좌',
    code: 'living',
    codeNum: 0,
    accounts: [
      'KB국민 계좌',
      '카카오페이 페이머니',
      'Toss 머니',
      '현금',
      '광진사랑상품권',
    ],
  },
];

const groupCheck = (account) => {
    return accountGroups.find(el => el.accounts.indexOf(account) !== -1).codeNum
}

