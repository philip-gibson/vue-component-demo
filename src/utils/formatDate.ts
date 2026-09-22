import dayjs from 'dayjs'

export function formatDate(value: Date | null | undefined, format: string): string {
  if (value && format) return dayjs(value).format(format)
  else return ''
}

export function formatDateRange(startDate: Date | undefined, endDate: Date | undefined): string {
  if (!startDate) return ''
  const start = formatDate(startDate, 'MMM DD, YYYY')
  if (!endDate) return `${start}`
  const end = formatDate(endDate, 'MMM DD, YYYY')
  return `${start} - ${end}`
}
