<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import IconAngleLeft from '@primeicons/vue/angle-left';
  import { useNavSideBarStore } from '@/stores/navSideBar'

  export interface NavSideBarState {
    collapsed: boolean
  }

  const { isCollapsed } = storeToRefs(useNavSideBarStore())

</script>

<template>
  <nav
    :class="[isCollapsed ? 'w-[4rem] px-[0.5rem]' : 'w-[15rem] px-[0.75rem]']"
    class="relative flex flex-col items-center h-full py-[1.5rem] transition-all ease-in duration-[360ms] bg-cyan-600 shadow-sm">
    <button
      class="flex absolute right-[-0.75rem] top-[1rem] h-[1.5rem] w-[1.5rem] items-center justify-center
        rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-xl"
      type="button"
      @click="isCollapsed = !isCollapsed">
      <IconAngleLeft :class="{ 'rotate-180': isCollapsed }" :size="20" />
    </button>
    <div class="flex grow flex-col items-center min-h-0 w-full flex-1 overflow-x-hidden">
      <ul class="w-full grow flex flex-col items-center justify-start gap-[0.5rem] py-[0.5rem] *:w-full">
        <li>
          <p>Custom Inputs</p>
        </li>
        <li>
          <p>PrimeVue</p>
        </li>
        <li>
          <p>Salesforce Bread Demo</p>
        </li>
      </ul>
    </div>
  </nav>
</template>
