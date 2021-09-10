import dotenv from 'dotenv'
import dayjs from 'dayjs'
import { routineFunc } from './manageGoogleAppsScript'
import { setTelegramBot, telegramSend } from './manageTelegram'
import { getRentAnnouncement } from './manageCrawling'

dotenv.config()

const main = async () => {
  setTelegramBot()
  routineFunc()
  getRentAnnouncement()
  telegramSend(`Node On ${dayjs().format('YYYY/MM/DD HH:mm')}`)
}

main()
