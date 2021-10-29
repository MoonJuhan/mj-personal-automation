import { callAppsScript } from './manageGoogleAppsScript'
let bot

const setTelegramBot = () => {
  const TelegramBot = require('node-telegram-bot-api')
  bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    const commandRegex = /구독 확인|구독 신청|신청 전송|구독 취소/

    if (!commandRegex.test(text)) {
      console.log(`message ${chatId} ${text}`)
      bot.sendMessage(chatId, '아래의 버튼을 눌러 기능을 실행하세요.', {
        reply_markup: {
          keyboard: [['구독 확인'], ['구독 신청'], ['구독 취소']],
        },
      })
    }
  })

  bot.onText(/구독 확인/, (msg, match) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, '구독 정보를 확인 중 입니다.')

    callAppsScript('getSubscription', { chatId }, (suc, res) => {
      if (!suc || !res.response) {
        console.log('구독 확인 중 문제 발생')
        bot.sendMessage(chatId, 'Error')
      } else {
        const result = res.response.result

        bot.sendMessage(chatId, result?.msg)
      }
    })
  })

  bot.onText(/구독 신청/, (msg, match) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, '구독 신청 기능을 개발 중 입니다.')
    // bot.sendMessage(chatId, '경기도를 선택하세요~~')
  })

  bot.onText(/신청 전송/, (msg, match) => {
    const chatId = msg.chat.id
    const filterString = match[1]
    // callGoogleAppsScript (chatId, filterString)

    // return값에 따라 반환 메시지 수정

    bot.sendMessage(chatId, '알림 구독이 신청되었습니다.')
    // bot.sendMessage(chatId, '알림 구독이 수정되었습니다.')
  })

  bot.onText(/구독 취소/, (msg, match) => {
    const chatId = msg.chat.id
    // callGoogleAppsScript (chatId)

    bot.sendMessage(chatId, '구독 취소 기능을 개발 중 입니다.')

    // bot.sendMessage(chatId, '알림 구독이 취소되었습니다.')
  })
}

const telegramSend = (message, chatId) => {
  bot.sendMessage(chatId ? chatId : process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' })
}

export { setTelegramBot, telegramSend }
