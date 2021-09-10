import axios from 'axios'
import dayjs from 'dayjs'
import { parse } from 'node-html-parser'
import { telegramSend } from './manageTelegram'

console.log('??')

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
        startDate: dayjs(el.PAN_DT).format('YYYY/MM/DD'),
      }
    })

    return announcementList.filter((el) => el.status !== '접수마감')
  } catch (error) {
    console.log(error.response)
    return []
  }
}

const getSHData = async () => {
  const url =
    'https://www.i-sh.co.kr/main/lay2/program/S1T294C297/www/brd/m_247/list.do?multi_itm_seq=2'
  try {
    const { data } = await axios.get(url)

    return refineSHData(data)
  } catch (error) {
    console.log(error.response)
    return []
  }
}

const getGhData = async () => {
  const url = 'https://apply.gh.or.kr/information/pblancList.do?#a'

  try {
    const { data } = await axios.get(url)

    return refineGHData(data)
  } catch (error) {
    console.log(error.response)
    return []
  }
}

const refineSHData = (html) => {
  const splitedHTML =
    '<div ' + html.split('id="listTb"')[1].split('<div class="pagingWrap">')[0]

  const root = parse(splitedHTML)
  const tbody = root.querySelector('tbody')
  const trList = tbody.querySelectorAll('tr')

  const refinedData = trList.map((el, index) => {
    const refineRawText = (string) => {
      return typeof string === 'string'
        ? string.replaceAll('\t', '').replaceAll('\n', '').replaceAll('\r', '')
        : ''
    }

    const returnTitle = el
      .querySelector('.txtL > a')
      .childNodes.find(
        (child) => refineRawText(child._rawText).length > 0
      )._rawText

    return {
      title: refineRawText(returnTitle),
      startDate: dayjs(
        refineRawText(el.querySelector('.num').childNodes[0]._rawText)
      ).format('YYYY/MM/DD'),
    }
  })

  return refinedData
}

const refineGHData = (html) => {
  const table = parse(html).querySelector('#pblancList')
  const tbody = table.querySelector('tbody')
  //   const trList = tbody.querySelectorAll('tr')
  console.log(tbody)

  // const refinedTrList = trList.filter((tr) =>
  //   tr.querySelectorAll('td')[1].childNodes[0]._rawText.includes('임대')
  // )

  //   const returnList = refinedTrList.map((tr) => {
  //     const tdList = tr.querySelectorAll('td')
  //     return {
  //       title: tdList[2].querySelector('a').childNodes[0]._rawText,
  //       startDate: dayjs(tdList[5].childNodes[0]._rawText).format('YYYY/MM/DD'),
  //     }
  //   })

  //   trList.forEach((tr, index) => {
  //     if (index < 2) {
  //       //   console.log(tr.querySelectorAll('td'))
  //       console.log(index)
  //       console.log(tr)
  //     }
  //   })

  return returnList || []
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

const refineDate = (list) => {
  return list.filter((el) => dayjs().diff(el.startDate, 'day') < 4)
}

const refineReturnATag = (announcement) => {
  return `<a href="${announcement.url}">${announcement.title} (${dayjs(
    announcement.startDate
  ).format('M/D')})</a>`
}

const getRentAnnouncement = async () => {
  const dataSeoul = await getLHData('11')
  const dataGyeongGi = refineGyeonGiList(await getLHData('41'))
  const lhAnnouncement = refineDate(dataSeoul.concat(dataGyeongGi))
  const shAnnouncement = refineDate(await getSHData())
  const ghAnnouncement = await getGhData()

  let returnString = `
공공임대 공고 조회 (${dayjs().format('M/D')})\n
✊ : 공고중
👉 : 접수중
🤚 : 기타\n
`

  returnString += `LH 공고 (${lhAnnouncement.length}개)\n`
  returnString += lhAnnouncement
    .map(
      (el) =>
        `<i>${
          el.status === '공고중' ? '✊' : el.status === '접수중' ? '👉' : '🤚'
        }</i>${refineReturnATag(el)}`
    )
    .join('\n')

  returnString += `\n\n<a href="https://www.i-sh.co.kr/main/lay2/program/S1T294C297/www/brd/m_247/list.do?multi_itm_seq=2">SH 공고 (${shAnnouncement.length}개)</a>\n`
  returnString += shAnnouncement
    .map((el) => `<i>🤚</i>${refineReturnATag(el)}`)
    .join('\n')

  returnString += `\n\nGH 공고 (${ghAnnouncement.length}개)\n`
  returnString += ghAnnouncement
    .map((el) => `<i>🤚</i>${refineReturnATag(el)}`)
    .join('\n')

  telegramSend(returnString)
}

export { getRentAnnouncement }
