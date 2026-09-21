import dayjs from 'dayjs'

export function formatDate(value: Date | null | undefined, format: string): string {
  if (value && format) return dayjs(value).format(format)
  else return ''
}
