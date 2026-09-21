<script lang="ts" setup>
  import { computed } from 'vue'

  import BaseButton, { type Size } from '@/components/BaseButton.vue'

  const props = defineProps<{
    size: Size
  }>()

  const shadow = computed(() =>
    props.size === 'xl' ? 'shadow-xl hover:shadow-xl/30' : 'hover:shadow-md'
  )
</script>

<template>
  <base-button
    :size="size"
    :variant-class="`text-blue-500 bg-white ring-1 ring-blue-500 hover:bg-gray-50 focus:ring-2 ring-inset disabled:opacity-50 disabled:bg-white dark:bg-inherit dark:text-blue-400 dark:hover:bg-gray-50 ${shadow}`">
    <slot />
  </base-button>
</template>
