import dotenv from 'dotenv'
import { routineFunc } from './manageGoogleAppsScript'
import { setTelegramBot, telegramSend } from './manageTelegram'
import { getRentAnnouncement } from './manageCrawling'

dotenv.config()

const main = async () => {
  setTelegramBot()
  routineFunc()
  telegramSend('Node On!')
  getRentAnnouncement()
}

main()
