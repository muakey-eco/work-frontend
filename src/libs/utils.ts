import dayjs from 'dayjs'
import locale from 'dayjs/locale/vi'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(minMax)

export const arrayMove = (array: any[], from: number, to: number) => {
  const newArray = [...array]

  newArray.splice(to, 0, newArray.splice(from, 1)[0])

  return newArray
}

export const randomColor = (s: string) => {
  let hash = 0
  for (var i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash)
  }

  var c = (hash & 0x00ffffff).toString(16).toUpperCase()

  return '#' + '00000'.substring(0, 6 - c.length) + c
}

export const abbreviateNumber = (number: number) => {
  const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

  const tier = (Math.log10(Math.abs(number)) / 3) | 0

  if (tier === 0) return number

  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = (number / scale).toFixed(1)

  const decimals = scaled.split('.')

  if (+decimals[1] <= 0) return decimals[0] + suffix

  return scaled + suffix
}

const stripParameters = (shortcodeString: string) => {
  if (shortcodeString.includes('?')) {
    shortcodeString = shortcodeString.split('?')[0]
  }

  if (shortcodeString.includes('/')) {
    shortcodeString = shortcodeString.split('/')[0]
  }

  if (shortcodeString.includes('&')) {
    shortcodeString = shortcodeString.split('&')[0]
  }

  return shortcodeString
}

export const getYoutubeVideoId = (youtubeString: string) => {
  let string_ = youtubeString

  // Remove the '-nocookie' flag from youtube urls
  string_ = string_.replace('-nocookie', '')

  // Remove time hash at the end of the string
  string_ = string_.replace(/#t=.*$/, '')

  // Strip the leading protocol
  string_ = string_.replace(/^https?:\/\//, '')

  // Shortcode
  const shortcode = /youtube:\/\/|youtu\.be\/|y2u\.be\//g

  if (shortcode.test(string_)) {
    const shortcodeid = string_.split(shortcode)[1]
    return stripParameters(shortcodeid)
  }

  // Shorts
  const shortsUrl = /\/shorts\//g
  if (shortsUrl.test(string_)) {
    return stripParameters(string_.split(shortsUrl)[1])
  }

  // V= or vi=
  const parameterv = /v=|vi=/g

  if (parameterv.test(string_)) {
    const array = string_.split(parameterv)
    return stripParameters(array[1].split('&')[0])
  }

  // /v/ or /vi/ or /watch/
  const inlinev = /\/v\/|\/vi\/|\/watch\//g

  if (inlinev.test(string_)) {
    const inlineid = string_.split(inlinev)[1]
    return stripParameters(inlineid)
  }

  // Format an_webp
  const parameterwebp = /\/an_webp\//g

  if (parameterwebp.test(string_)) {
    const webp = string_.split(parameterwebp)[1]
    return stripParameters(webp)
  }

  // /e/
  const eformat = /\/e\//g

  if (eformat.test(string_)) {
    const estring = string_.split(eformat)[1]
    return stripParameters(estring)
  }

  // Embed
  const embedreg = /\/embed\//g

  if (embedreg.test(string_)) {
    const embedid = string_.split(embedreg)[1]
    return stripParameters(embedid)
  }

  // ignore /user/username pattern
  const usernamereg = /\/user\/([a-zA-Z\d]*)$/g

  if (usernamereg.test(string_)) {
    return undefined
  }

  // User
  const userreg = /\/user\/(?!.*videos)/g

  if (userreg.test(string_)) {
    const elements = string_.split('/')
    return stripParameters(elements.pop() || '')
  }

  // Attribution_link
  const attrreg = /\/attribution_link\?.*v%3D([^%&]*)(%26|&|$)/

  if (attrreg.test(string_)) {
    return stripParameters(string_.match(attrreg)?.[1] || '')
  }

  // Live
  const livereg = /\/live\//g

  if (livereg.test(string_)) {
    const liveid = string_.split(livereg)[1]
    return stripParameters(liveid)
  }

  return undefined
}

export default getYoutubeVideoId

dayjs.extend(relativeTime)
dayjs.locale(locale)

export const convertRelativeTime = (date: Date) => {
  const relativeDate = dayjs(date).fromNow()

  return relativeDate
}

export const base64ToFile = (base64: string) => {
  const byteString = atob(base64.split(',')[1])
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]

  const byteArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }

  return new File([byteArray], 'upload', { type: mimeString })
}

export const extractLinks = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const links = Array.from(doc.querySelectorAll('a')).map((a) => a.href)
  return links
}

export const generateUrl = (str: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g

  return str.match(urlRegex)
}

export const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export const daysOfWeek = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật',
]

export const getWeek = (date: Date, numberOfWeek?: number) => {
  if (String(dayjs(date).format('ddd')) === 'CN') {
    date.setDate(date.getDate() - 1)
  }

  const startOfWeek = new Date(date)

  startOfWeek.setDate(
    date.getDate() - date.getDay() + 1 + +(numberOfWeek || 0) * 7,
  )

  return daysOfWeek.map((day: string, index: number) => {
    const currentDate = new Date(startOfWeek)
    currentDate.setDate(startOfWeek.getDate() + index)

    return {
      day,
      date: dayjs(currentDate).format('YYYY-MM-DD'),
    }
  })
}

export const convertTime = (seconds: number) => {
  const durationObj = dayjs.duration(seconds, 'seconds')

  const year = durationObj.years()
  const days = durationObj.days()
  const months = durationObj.months()
  const hours = durationObj.hours()
  const minutes = durationObj.minutes()
  const secs = durationObj.seconds()

  switch (true) {
    case !!year:
      return `${year} năm`

    case !!months:
      return `${months} tháng`

    case !!days:
      return `${days} ngày`

    case !!hours:
      return `${hours} giờ`

    case !!minutes:
      return `${minutes} phút`

    case !!secs:
      return `${secs} giây`

    default:
      return null
  }
}

const generateShift = (day: string) => {
  // Thời gian bắt đầu ca sáng
  const startM = new Date(`${day} 08:30:00`)
  // Thời gian kết thúc ca tối
  const endM = new Date(`${day} 12:00:00`)
  // Thời gian bắt đầu ca chiều
  const startA = new Date(`${day} 13:30:00`)
  // Thời gian kết thúc ca chiều
  const endA = new Date(`${day} 17:30:00`)

  return { startM, endM, startA, endA }
}

export const calculateDayOffTotal = (
  startDate: string,
  endDate: string,
): number => {
  const workStart = '08:30:00'
  const lunchStart = '12:00:00'
  const lunchEnd = '13:30:00'
  const workEnd = '17:30:00'
  const msPerHour = 1000 * 60 * 60
  const workHoursPerDay = 7.5

  const start = dayjs(startDate)
  const end = dayjs(endDate)

  if (start.isAfter(end)) return 0

  let totalWorkHours = 0
  let current = start.startOf('day')

  while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
    const dateStr = current.format('YYYY-MM-DD')

    // Thời gian làm việc trong ngày
    const dayStart = dayjs(`${dateStr} ${workStart}`)
    const dayLunchStart = dayjs(`${dateStr} ${lunchStart}`)
    const dayLunchEnd = dayjs(`${dateStr} ${lunchEnd}`)
    const dayEnd = dayjs(`${dateStr} ${workEnd}`)

    let fromTime = dayStart
    let toTime = dayEnd

    if (current.isSame(start, 'day')) {
      fromTime = dayjs(start)
    }

    if (current.isSame(end, 'day')) {
      toTime = dayjs(end)
    }

    // Cắt theo giờ làm việc
    const actualStart = dayjs.max(fromTime, dayStart)
    const actualEnd = dayjs.min(toTime, dayEnd)

    if (actualEnd.isAfter(actualStart)) {
      let workDuration = actualEnd.diff(actualStart, 'millisecond')

      // Trừ thời gian nghỉ trưa nếu giao nhau
      const overlapLunchStart = dayjs.max(actualStart, dayLunchStart)
      const overlapLunchEnd = dayjs.min(actualEnd, dayLunchEnd)

      if (overlapLunchEnd.isAfter(overlapLunchStart)) {
        const lunchOverlap = overlapLunchEnd.diff(
          overlapLunchStart,
          'millisecond',
        )
        workDuration -= lunchOverlap
      }

      totalWorkHours += workDuration / msPerHour
    }

    current = current.add(1, 'day')
  }

  return Number((totalWorkHours / workHoursPerDay).toFixed(3))
}

export const maskValue = (cc: any, num = 4, mask = '*') =>
  `${cc}`.slice(-num).padStart(`${cc}`.length, mask)

export const formatLable = (label: string) => {
  switch (label) {
    case 'total_holiday_with_salary':
      return 'Tổng ngày phép có hưởng lương'
    case 'seniority_holiday':
      return 'Phép thâm niên'
    default:
      return label
  }
}
