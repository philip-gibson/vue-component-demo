<script lang="ts" setup>
  defineProps<{
    selected: boolean
  }>()
</script>

<template>
  <h2
    :class="[selected ? '!text-emerald-100' : '!text-cyan-500']"
    class="typography-lg font-[poppins] font-bold text-nowrap group-hover:!text-emerald-100">
    <slot />
  </h2>
</template>
