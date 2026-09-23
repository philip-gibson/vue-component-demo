<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import IconAngleLeft from '@primeicons/vue/angle-left'
  import ButtonDarkMode from './ButtonDarkMode.vue'
  import NavSideBarHome from '@/components/NavSideBarHome.vue'
  import NavSideBarInputs from '@/components/NavSideBarInputs.vue'
  import NavSideBarPrimeVue from '@/components/NavSideBarPrimeVue.vue'
  import NavSideBarSalesforce from '@/components/NavSideBarSalesforce.vue'
  import NavSideBarEvents from '@/components/NavSideBarEvents.vue'
  import { useNavSideBarStore } from '@/stores/navSideBar'

  export interface NavSideBarState {
    collapsed: boolean
  }

  const { isCollapsed } = storeToRefs(useNavSideBarStore())

</script>

<template>
  <nav
    :class="[isCollapsed ? 'w-[4rem]' : 'w-[15rem]']"
    class="relative flex flex-col items-center h-full py-[0.75rem] transition-all ease-in duration-[360ms] bg-cyan-600 shadow-xl/30">
    <ButtonDarkMode />
    <button
      class="flex absolute right-[-0.75rem] top-[1rem] h-[1.5rem] w-[1.5rem] items-center justify-center
        rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-xl cursor-pointer"
      type="button"
      @click="isCollapsed = !isCollapsed">
      <IconAngleLeft :class="{ 'rotate-180': isCollapsed }" :size="20" />
    </button>
    <div class="flex grow flex-col items-center min-h-0 w-full flex-1 overflow-x-hidden">
      <ul class="w-full grow flex flex-col items-center justify-start gap-[1rem] py-[1rem] *:w-full">
        <NavSideBarHome :collapsed="isCollapsed" />
        <NavSideBarInputs :collapsed="isCollapsed" />
        <NavSideBarPrimeVue :collapsed="isCollapsed" />
        <NavSideBarSalesforce :collapsed="isCollapsed" />
        <NavSideBarEvents :collapsed="isCollapsed" />
      </ul>
    </div>
  </nav>
</template>
