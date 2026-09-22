<script lang="ts" setup>
  import Tag from 'primevue/tag'
  import { computed } from 'vue'

  const props = defineProps<{
    programs?: Array<{ name: string; ulid: string }>
  }>()

  const MAX_PROGRAM_TAGS = 2

  const hiddenCount = computed(() => {
    if (!props.programs?.length) return 0
    if (props.programs.length <= MAX_PROGRAM_TAGS) return 0
    const maxVisiblePrograms = MAX_PROGRAM_TAGS - 1
    return props.programs.length - maxVisiblePrograms
  })

  const visiblePrograms = computed(() => {
    if (!props.programs?.length) return []
    if (props.programs.length <= MAX_PROGRAM_TAGS) {
      return props.programs
    }
    const maxVisiblePrograms = MAX_PROGRAM_TAGS - 1
    return props.programs.slice(0, maxVisiblePrograms)
  })

  const evenWidths = computed(() => visiblePrograms.value.length === MAX_PROGRAM_TAGS && hiddenCount.value === 0)
</script>

<template>
  <div v-if="programs?.length" class="programs flex gap-2">
    <Tag
      v-for="program in visiblePrograms"
      :key="program.ulid"
      :class="{ 'max-w-[calc(50%-0.25rem)]': evenWidths }"
      :value="program.name"
      class="flex-initial"
      rounded />
    <Tag v-if="hiddenCount > 0" :value="`+${hiddenCount}`" class="shrink-0" rounded />
  </div>
</template>

<style scoped>
  @reference "../assets/main.css";
  .programs :deep(.p-tag) {
    overflow: hidden;
    white-space: nowrap;
    border-radius: var(--tag-rounded-border-radius, 12px);
    background: var(--Blue-50, #deeaff);
  }

  .programs :deep(.p-tag-label) {
    color: var(--Blue-700, #0047c7);
    font-size: var(--tag-font-size, 12.25px);
    font-weight: var(--tag-font-weight, 700);
    line-height: normal;
  }

  .programs :deep(.p-tag span) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
