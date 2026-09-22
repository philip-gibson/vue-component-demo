<script lang="ts" setup>
  defineProps<{
    selected: boolean
  }>()
</script>

<template>
  <div
    :class="[selected ? 'border border-cyan-500 hover:bg-cyan-500 hover:shadow-lg/10' : 'border border-cyan-600']"
    class="group flex items-center justify-start gap-[0.5rem] min-h-[3rem] min-w-[3rem] w-full px-[0.675rem] rounded-[0.5rem]">
    <slot />
  </div>
</template>
