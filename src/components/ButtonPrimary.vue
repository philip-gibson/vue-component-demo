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
    :variant-class="`text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-500 ${shadow}`">
    <slot />
  </base-button>
</template>
