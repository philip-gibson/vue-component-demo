<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import IconAngleLeft from '@primeicons/vue/angle-left'
  import { useNavSideBarStore } from '@/stores/navSideBar'

  const { isCollapsed } = storeToRefs(useNavSideBarStore())
</script>

<template>
  <button
    class="flex absolute right-[-0.75rem] top-[1rem] h-[1.5rem] w-[1.5rem] items-center justify-center
      rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-xl cursor-pointer"
    type="button"
    @click="isCollapsed = !isCollapsed">
    <IconAngleLeft :class="{ 'rotate-180': isCollapsed }" :size="20" />
  </button>
</template>
