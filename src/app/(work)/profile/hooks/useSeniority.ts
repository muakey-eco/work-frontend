import { useMemo } from 'react'

const useSeniority = (startWorkDate: string | undefined) => {
  return useMemo(() => {
    if (!startWorkDate) return ''

    const start = new Date(startWorkDate)
    const today = new Date()

    let years = today.getFullYear() - start.getFullYear()
    let months = today.getMonth() - start.getMonth()
    let days = today.getDate() - start.getDate()

    // Điều chỉnh ngày nếu nhỏ hơn 0
    if (days < 0) {
      months -= 1
      const prevMonthDays = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
      ).getDate()
      days += prevMonthDays
    }

    // Điều chỉnh tháng nếu nhỏ hơn 0
    if (months < 0) {
      years -= 1
      months += 12
    }

    return `${years} Năm ${months} Tháng ${days} Ngày`
  }, [startWorkDate])
}

export default useSeniority
