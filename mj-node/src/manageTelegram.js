import { callAppsScript } from './manageGoogleAppsScript'
let bot

const setTelegramBot = () => {
  const TelegramBot = require('node-telegram-bot-api')
  bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    const commandRegex = /구독 확인|구독 신청|구독 취소|구독 수정/

    const startRegex = /\/start/

    if (!commandRegex.test(text) && !startRegex.test(text)) {
      console.log(`message ${chatId} ${text}`)
      bot.sendMessage(chatId, '아래의 버튼을 눌러 기능을 실행하세요.', {
        reply_markup: {
          keyboard: [['구독 확인'], ['구독 신청'], ['구독 취소']],
        },
      })
    } else if (startRegex.test(text)) {
      bot.sendMessage(chatId, '안녕하세요! MJ-Telegram-Bot 입니다.\n\n저는 LH, SH, GH의 공공 임대 주택 공고를 알려주는 기능이 있습니다.\n알림은 매일 09:30, 18:00 두번 전송됩니다.\n\n아래의 버튼을 눌러 기능을 실행하세요.', {
        reply_markup: {
          keyboard: [['구독 확인'], ['구독 신청'], ['구독 취소']],
        },
      })
    }
  })

  bot.onText(/구독 확인/, async (msg, match) => {
    const chatId = msg.chat.id

    await bot.sendMessage(chatId, '구독 정보를 확인 중 입니다.')

    await callAppsScript('getSubscription', { chatId }, (suc, res) => {
      if (!suc || !res.response) {
        console.log('구독 확인 중 문제 발생')
        bot.sendMessage(chatId, 'Error')
      } else {
        const result = res.response.result

        bot.sendMessage(chatId, result?.msg, {
          reply_markup: {
            keyboard: [['구독 신청'], ['구독 수정'], ['구독 취소']],
          },
        })
      }
    })
  })

  bot.onText(/구독 수정/, async (msg, match) => {
    const chatId = msg.chat.id
    await bot.sendMessage(chatId, '구독 수정은 기존의 구독 정보를 삭제 후 재신청 방식으로 작동합니다.')

    deleteSubscription(chatId, async (resultMessage) => {
      await bot.sendMessage(chatId, resultMessage)
      showSubmitLink(chatId)
    })
  })

  bot.onText(/구독 신청/, (msg, match) => {
    const chatId = msg.chat.id

    showSubmitLink(chatId)
  })

  bot.onText(/구독 취소/, (msg, match) => {
    const chatId = msg.chat.id
    deleteSubscription(chatId, (resultMessage) => {
      bot.sendMessage(chatId, resultMessage, {
        reply_markup: {
          keyboard: [['구독 확인'], ['구독 신청']],
        },
      })
    })
  })
}

const showSubmitLink = (chatId) => {
  bot.sendMessage(chatId, `<a href="${process.env.GOOGLE_SUBMIT_LINK}?entry.599228765=${chatId}">구글 설문지로 구독 신청을 해주세요.</a>`, {
    parse_mode: 'HTML',
    reply_markup: {
      keyboard: [['구독 확인'], ['구독 수정'], ['구독 취소']],
    },
  })
}

const deleteSubscription = async (chatId, callback) => {
  await bot.sendMessage(chatId, '구독 정보를 삭제 중 입니다.')

  await callAppsScript('deleteSubscription', { chatId }, (suc, res) => {
    if (!suc || !res.response) {
      console.log('구독 삭제 중 문제 발생')
      bot.sendMessage(chatId, 'Error')
    } else {
      const result = res.response.result

      callback(result?.msg)
    }
  })
}

const telegramSend = (message, chatId) => {
  bot.sendMessage(chatId ? chatId : process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' })
}

export { setTelegramBot, telegramSend }
