/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isNumber, isObject } from './typeChecks'

/**
 * 格式化值
 * @param data
 * @param key
 * @param defaultValue
 * @returns {string|*}
 */
export function formatValue (data, key, defaultValue = '--') {
  if (data && isObject(data)) {
    const value = data[key]
    if (value || value === 0 || value === false) {
      return value
    }
  }
  return defaultValue
}

/**
 * 格式化时间
 * @param dateTimeFormat
 * @param timestamp
 * @param format
 * @returns {string}
 */
export function formatDate (dateTimeFormat, timestamp, format) {
  if (timestamp && isNumber(timestamp)) {
    const date = new Date(timestamp)
    const dateTimeString = dateTimeFormat.format(date)
    const dateString = dateTimeString.match(/^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}/)[0]
    const dateStringArray = dateString.split('/')
    const month = `${dateStringArray[0].length === 1 ? `0${dateStringArray[0]}` : dateStringArray[0]}`
    const day = `${dateStringArray[1].length === 1 ? `0${dateStringArray[1]}` : dateStringArray[1]}`
    let timeString = dateTimeString.match(/[\d]{2}:[\d]{2}$/)[0]
    // 这里将小时24转换成00
    if (timeString.match(/^[\d]{2}/)[0] === '24') {
      timeString = timeString.replace(/^[\d]{2}/, '00')
    }
    switch (format) {
      case 'YYYY': {
        return dateStringArray[2]
      }
      case 'YYYY-MM': {
        return `${dateStringArray[2]}-${month}`
      }
      case 'YYYY-MM-DD': {
        return `${dateStringArray[2]}-${month}-${day}`
      }
      case 'YYYY-MM-DD hh:mm': {
        return `${dateStringArray[2]}-${month}-${day} ${timeString}`
      }
      case 'MM-DD': {
        return `${month}-${day}`
      }
      case 'hh:mm': {
        return timeString
      }
      default: {
        return `${month}-${day} ${timeString}`
      }
    }
  }
  return '--'
}

/**
 * 格式化精度
 */
export function formatPrecision (value, precision = 2) {
  if (isNaN(value)) {
    return value
  }
  const v = +value
  if ((v || v === 0) && isNumber(v)) {
    return v.toFixed(precision)
  }
  return `${v}`
}

/**
 * 格式化大数据
 * @param value
 */
export function formatBigNumber (value, language = 'en') {
  value = +value
  if (isNumber(value)) {
    return language === 'zh-CN' ? formatBigNumberInChinese(value) : formatBigNumberInEnglish(value)
  }
  return '--'
}

function formatBigNumberInEnglish (value) {
  if (value > 1000000000) {
    return `${(value / 1000000000).toFixed(3)}B`
  }
  if (value > 1000000) {
    return `${(value / 1000000).toFixed(3)}M`
  }
  if (value > 10000) {
    return `${(value / 1000).toFixed(3)}K`
  }
  return value
}

function formatBigNumberInChinese(value) {
  if (value > 100000000) {
    return `${(value / 100000000).toFixed(3)}亿`
  }
  if (value > 10000000) {
    return `${(value / 10000000).toFixed(3)}千万`
  }
  if (value > 100000) {
    return `${(value / 10000).toFixed(3)}万`
  }
  return value
}
