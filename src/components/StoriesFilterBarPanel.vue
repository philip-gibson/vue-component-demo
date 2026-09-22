<script lang="ts" setup>
  import Panel, { type PanelPassThroughOptions } from 'primevue/panel'
  import { ref } from 'vue'

  defineProps<{
    pt: PanelPassThroughOptions
  }>()

  const collapsedPanel = ref(true)

  const togglePanel = () => (collapsedPanel.value = !collapsedPanel.value)
</script>

<template>
  <Panel
    :class="{ '!border-gray-50 !bg-gray-50': !collapsedPanel }"
    :pt="pt"
    class="w-full"
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
      <i v-if="collapsed" class="pi pi-chevron-down !text-[0.875rem]"></i>
      <i v-else class="pi pi-chevron-up !text-[0.875rem]"></i>
    </template>
    <slot></slot>
  </Panel>
</template>
