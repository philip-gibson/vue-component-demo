<script lang="ts" setup>
  import Moon from '@primeicons/vue/moon'
  import Sun from '@primeicons/vue/sun'
  import { useDarkMode } from '@/composables/useDarkMode'

  const { isDark, toggleDark } = useDarkMode()
</script>

<template>
  <button
    :class="[ isDark ? 'bg-cyan-500' : 'bg-cyan-800']"
    class="group flex items-center justify-start h-[2rem] min-w-[3rem] w-full px-[1.25rem] shadow-lg"
    type="button"
    @click="toggleDark()">
    <Sun v-if="isDark" color="var(--p-amber-500)" size="24" />
    <Moon v-else color="var(--p-cyan-950)" size="24" />
  </button>
</template>
