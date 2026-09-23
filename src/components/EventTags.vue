<script lang="ts" setup>
  import Tag from 'primevue/tag'
  import { computed } from 'vue'

  const props = defineProps<{
    eventTypes?: Array<{ name: string; ulid: string }>
  }>()

  const MAX_EVENT_TYPE_TAGS = 2

  const hiddenCount = computed(() => {
    if (!props.eventTypes?.length) return 0
    if (props.eventTypes.length <= MAX_EVENT_TYPE_TAGS) return 0
    const maxVisibleEventTypes = MAX_EVENT_TYPE_TAGS - 1
    return props.eventTypes.length - maxVisibleEventTypes
  })

  const visibleEventTypes = computed(() => {
    if (!props.eventTypes?.length) return []
    if (props.eventTypes.length <= MAX_EVENT_TYPE_TAGS) {
      return props.eventTypes
    }
    const maxVisibleEventTypes = MAX_EVENT_TYPE_TAGS - 1
    return props.eventTypes.slice(0, maxVisibleEventTypes)
  })

  const evenWidths = computed(() => visibleEventTypes.value.length === MAX_EVENT_TYPE_TAGS && hiddenCount.value === 0)
</script>

<template>
  <div v-if="eventTypes?.length" class="eventTypes flex gap-2">
    <Tag
      v-for="eventType in visibleEventTypes"
      :key="eventType.ulid"
      :class="{ 'max-w-[calc(50%-0.25rem)]': evenWidths }"
      :value="eventType.name"
      class="flex-initial dark:!bg-sky-800"
      rounded />
    <Tag v-if="hiddenCount > 0" :value="`+${hiddenCount}`" class="shrink-0" rounded />
  </div>
</template>

<style scoped>
  .eventTypes :deep(.p-tag) {
    overflow: hidden;
    white-space: nowrap;
    border-radius: var(--tag-rounded-border-radius, 12px);
    background: var(--Blue-50, #deeaff);
  }

  .eventTypes :deep(.p-tag-label) {
    color: var(--Blue-700, #0047c7);
    font-size: var(--tag-font-size, 12.25px);
    font-weight: var(--tag-font-weight, 700);
    line-height: normal;
  }

  .dark .eventTypes :deep(.p-tag-label) {
    color: var(--p-gray-100);
  }

  .eventTypes :deep(.p-tag span) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
