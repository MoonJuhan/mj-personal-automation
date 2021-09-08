import dotenv from 'dotenv'
import { routineFunc } from './manageGoogleAppsScript'
import { setTelegramBot, telegramSend } from './manageTelegram'

dotenv.config()

const main = async () => {
  routineFunc()
  setTelegramBot()

  telegramSend('Node On!')
}

main()
