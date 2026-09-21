<script lang="ts" setup>
  withDefaults(
    defineProps<{
      shadow?: boolean
      rounded?: boolean
      border?: boolean
    }>(),
    {
      shadow: false,
      rounded: false,
      border: false,
    }
  )
</script>
<template>
  <div
    class="flex flex-col p-[1.5rem] bg-white dark:bg-gray-900"
    :class="{ 'shadow-lg': shadow, 'rounded-[0.5rem]': rounded, 'border border-gray-200': border }">
    <slot />
  </div>
</template>
