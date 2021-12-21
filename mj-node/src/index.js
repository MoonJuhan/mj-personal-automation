import dotenv from 'dotenv'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { routineFunc } from './manageGoogleAppsScript'
import { setTelegramBot, telegramSend } from './manageTelegram'
import { setScheduler } from './manageScheduler'

dotenv.config()

dayjs.extend(utc)
dayjs.extend(timezone)

const main = async () => {
  console.log('Process Start')
  setTelegramBot()
  routineFunc()
  telegramSend(`Node On ${dayjs().tz('Asia/Seoul').format('YYYY/MM/DD HH:mm')}`)
  setScheduler()
}

main()
