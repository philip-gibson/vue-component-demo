import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { LocalStorageKeys } from '@/constants'

export const useNavSideBarStore = defineStore('navSideBar', () => {
  const isCollapsed = useStorage(LocalStorageKeys.NAV_SIDE_BAR_COLLAPSED, false)

  return { isCollapsed }
})
