import schedule from 'node-schedule'
import { getRentAnnouncement } from './manageCrawling'

const setScheduler = () => {
  const schedule0930 = schedule.scheduleJob('00 30 09 * * *', () => {
    console.log('09 30 실행')
    getRentAnnouncement()
  })

  const schedule1800 = schedule.scheduleJob('00 00 18 * * *', () => {
    console.log('18 00 실행')
    getRentAnnouncement()
  })
}

export { setScheduler }
