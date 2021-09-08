import axios from 'axios'
import dayjs from 'dayjs'
import { telegramSend } from './manageTelegram'

const getLHData = async (areaCode) => {
  const start = dayjs().subtract(30, 'day').format('YYYY.MM.DD')
  const end = dayjs().format('YYYY.MM.DD')

  const url =
    'http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1'

  try {
    const { data } = await axios.get(url, {
      params: {
        ServiceKey: process.env.CRAWLING_LH_SERVICE_KEY,
        PG_SZ: 20,
        PAGE: 1,
        UPP_AIS_TP_CD: '06',
        PAN_NT_ST_DT: start,
        CLSG_DT: end,
        CNP_CD: areaCode,
      },
    })

    const announcementList = data[1].dsList.map((el) => {
      return {
        title: el.PAN_NM,
        status: el.PAN_SS,
        url: el.DTL_URL,
        area: el.CNP_CD_NM,
        category: el.AIS_TP_CD_NM,
        endDate: el.CLSG_DT,
        startDate: el.PAN_DT,
      }
    })

    return announcementList.filter((el) => el.status !== '접수마감')
  } catch (error) {
    console.log(error.response)
  }
}
