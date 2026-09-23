<script lang="ts" setup>
  import Panel, { type PanelPassThroughOptions } from 'primevue/panel'
  import { ref } from 'vue'
  import ChevronDown from '@primeicons/vue/chevron-down'
  import ChevronUp from '@primeicons/vue/chevron-up'

  defineProps<{
    pt: PanelPassThroughOptions
  }>()

  const collapsedPanel = ref(true)

  const togglePanel = () => (collapsedPanel.value = !collapsedPanel.value)
</script>

<template>
  <Panel
    :class="[ collapsedPanel ? 'dark:!bg-gray-800' : '!border-gray-50 !bg-gray-50 dark:!border-gray-700 dark:!bg-gray-700' ]"
    :pt="pt"
    :collapsed="collapsedPanel"
    toggleable
    @update:collapsed="collapsedPanel = $event">
    <template #header>
      <div
        class="w-full"
        role="button"
        tabindex="0"
        @click="togglePanel"
        @keydown.enter="togglePanel"
        @keydown.space.prevent="togglePanel">
        <slot name="header"></slot>
      </div>
    </template>
    <template #toggleicon="{ collapsed }">
      <ChevronDown v-if="collapsed" size="16" />
      <ChevronUp v-else size="16" />
    </template>
    <slot></slot>
  </Panel>
</template>
