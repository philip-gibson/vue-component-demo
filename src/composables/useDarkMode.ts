import { useDark, useStorage, useToggle } from '@vueuse/core'

import { LocalStorageKeys } from '@/constants'
import type { Ref } from 'vue'

export function useDarkMode() {
  const localDarkModeEnabled = useStorage(LocalStorageKeys.DARK_MODE, false)
  const isDark: Ref<boolean> = useDark()
  const toggleDark = useToggle(isDark)
  /**
   * We need to turn off DarkMode if the user does not
   * have our "feature" flag enabled
   */
  if (isDark.value && !localDarkModeEnabled.value) {
    toggleDark()
  }
  return {
    localDarkModeEnabled,
    isDark,
    toggleDark,
  }
}
