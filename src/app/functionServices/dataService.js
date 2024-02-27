import { format, parse } from 'date-fns'

const astanaTimezone = 6

export function parseToISOS (str) {
  if (str) {
    return parse(str, 'dd.MM.yyyy HH:mm', new Date()).toISOString()
  }
  return ''
}

export function parseToTimezoneISOS (str) {
  if (str) {
    const diffTimeZone = astanaTimezone
    let attributeValueDate = parse(str, 'dd.MM.yyyy HH:mm', new Date())
    attributeValueDate.setTime(attributeValueDate.getTime() - diffTimeZone * 3600000)
    return attributeValueDate.toISOString()
  }
  return ''
}

export function parseToTime (milliseconds) {
  let result = milliseconds < 0 ? '-' : ''
  let posValue = Math.abs(milliseconds / 1000)

  let hours = Math.floor(posValue / 3600)
  let minutes = Math.floor((posValue - hours * 3600) / 60)
  let seconds = Math.floor(posValue - hours * 3600 - minutes * 60)

  result += hours + ':'
  result += (minutes.toString().length > 1 ? minutes : '0' + minutes) + ':'
  result += (seconds.toString().length > 1 ? seconds : '0' + seconds)
  return result
}

export function toTimezone (str) {
  if (str) {
    const diffTimeZone = astanaTimezone
    let attributeValueDate = parse(str, 'dd.MM.yyyy HH:mm', new Date())
    let time = attributeValueDate.getTime() - diffTimeZone * 3600000
    // return time as a string
    return format(time, 'dd.MM.yyyy HH:mm')
  }
  return ''
}
export function getFormattedDate (str) {
  let x = new Date()
  let date = ''
  if (str) {
    try {
      let attributeValueDate = new Date(str)
      let utc = attributeValueDate.getTime() + (x.getTimezoneOffset() * 60000)
      const nd = new Date(utc + (3600000 * astanaTimezone))
      date = format(nd, 'dd.MM.yyyy HH:mm')
    } catch (e) {
      date = str
    }
  }
  return date
}
export function getDateDay (str) {
  let x = new Date()
  let date = ''
  if (str) {
    try {
      let attributeValueDate = new Date(str)
      let utc = attributeValueDate.getTime() + (x.getTimezoneOffset() * 60000)
      const nd = new Date(utc + (3600000 * astanaTimezone))
      date = format(nd, 'dd.MM.yyyy')
    } catch (e) {
      date = str
    }
  }
  return date
}
