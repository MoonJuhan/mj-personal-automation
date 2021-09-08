import axios from 'axios'
import dayjs from 'dayjs'
import { telegramSend } from './manageTelegram'

const getLHData = async (areaCode) => {
  const start = dayjs().subtract(3, 'day').format('YYYY.MM.DD')
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
        startDate: dayjs(el.PAN_DT).format('M/D'),
      }
    })

    return announcementList.filter((el) => el.status !== '접수마감')
  } catch (error) {
    console.log(error.response)
  }
}

const refineGyeonGiList = (list) => {
  const targets = ['남양주', '하남', '구리']

  const returnList = []

  targets.forEach((target) => {
    list
      .filter((el) => el.title.includes(target))
      .forEach((announcement) => returnList.push(announcement))
  })

  return returnList.filter((item, index) => returnList.indexOf(item) === index)
}

const getRentAnnouncement = async () => {
  const dataSeoul = await getLHData('11')
  const dataGyeongGi = refineGyeonGiList(await getLHData('41'))
  const announcementList = dataSeoul.concat(dataGyeongGi)

  let returnString = `
공공임대 공고 조회 (${dayjs().format('M/D')})\n
✊ : 공고중
👉 : 접수중
🤚 : 기타\n
`

  returnString += 'LH 공고\n'
  returnString += announcementList
    .map(
      (el) =>
        `<i>${
          el.status === '공고중' ? '✊' : el.status === '접수중' ? '👉' : '🤚'
        }</i><a href="${el.url}">${el.title} (${el.startDate})</a>`
    )
    .join('\n')

  telegramSend(returnString)
}

export { getRentAnnouncement }
