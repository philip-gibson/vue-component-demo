import { useDark, useToggle } from '@vueuse/core'

import { LocalStorageKeys } from '@/constants'

export function useDarkMode() {
  const isDark = useDark({
    selector: 'body',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: LocalStorageKeys.DARK_MODE,
  })
  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark,
  }
}
