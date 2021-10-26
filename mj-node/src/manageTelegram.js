let bot

const setTelegramBot = () => {
  const TelegramBot = require('node-telegram-bot-api')
  bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

  bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]
    console.log(`onText ${chatId}`)
    bot.sendMessage(chatId, resp)
  })

  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    console.log(`message ${chatId}`)
    bot.sendMessage(chatId, 'Received your message')
  })
}

const telegramSend = (message, chatId) => {
  bot.sendMessage(chatId ? chatId : process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' })
}

export { setTelegramBot, telegramSend }
