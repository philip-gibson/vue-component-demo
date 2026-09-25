<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import ButtonNavSideBarDarkMode from '@/components/ButtonNavSideBarDarkMode.vue'
  import ButtonNavSideBarCollapse from '@/components/ButtonNavSideBarCollapse.vue'
  import NavSideBarHome from '@/components/NavSideBarHome.vue'
  import NavSideBarInputs from '@/components/NavSideBarInputs.vue'
  import NavSideBarPrimeVue from '@/components/NavSideBarPrimeVue.vue'
  import NavSideBarSalesforce from '@/components/NavSideBarSalesforce.vue'
  import NavSideBarEvents from '@/components/NavSideBarEvents.vue'
  import { useNavSideBarStore } from '@/stores/navSideBar'

  const { isCollapsed } = storeToRefs(useNavSideBarStore())

</script>

<template>
  <nav
    :class="[isCollapsed ? 'w-[4rem]' : 'w-[15rem]']"
    class="relative flex flex-col items-center h-full py-[0.75rem] transition-all ease-in duration-[360ms] bg-cyan-600 shadow-xl/30">
    <ButtonNavSideBarDarkMode />
    <ButtonNavSideBarCollapse />
    <div class="flex grow flex-col items-center min-h-0 w-full flex-1 overflow-x-hidden">
      <ul class="w-full grow flex flex-col items-center justify-start gap-[1rem] py-[1rem] *:w-full">
        <NavSideBarHome />
        <NavSideBarInputs />
        <NavSideBarPrimeVue />
        <NavSideBarSalesforce />
        <NavSideBarEvents />
      </ul>
    </div>
  </nav>
</template>
