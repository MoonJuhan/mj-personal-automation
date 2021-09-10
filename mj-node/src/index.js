import dotenv from 'dotenv'
import dayjs from 'dayjs'
import { routineFunc } from './manageGoogleAppsScript'
import { setTelegramBot, telegramSend } from './manageTelegram'
import { getRentAnnouncement } from './manageCrawling'

dotenv.config()

const main = async () => {
  setTelegramBot()
  routineFunc()
  telegramSend(`Node On ${dayjs().format('YYYY/MM/DD HH:mm')}`)
  try {
    getRentAnnouncement()
  } catch (error) {
    console.log(error)
  }
}

main()
