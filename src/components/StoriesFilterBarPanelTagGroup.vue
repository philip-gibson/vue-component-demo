<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import Badge from 'primevue/badge'
  import type { PanelPassThroughOptions } from 'primevue/panel'
  import Tag from 'primevue/tag'
  import { computed } from 'vue'
  import StoriesFilterBarPanel from '@/components/StoriesFilterBarPanel.vue'
  import type { TagGroup } from '@/components/types'
  import { useStoriesFilterStore } from '@/stores/storiesFilter'

  const props = defineProps<{
    pt: PanelPassThroughOptions
    group: TagGroup
  }>()

  const filterStore = useStoriesFilterStore()
  const { selectedTaggings } = storeToRefs(filterStore)

  const handleClickTag = (ulid: string) => {
    if (isSelected(ulid)) {
      selectedTaggings.value = selectedTaggings.value.filter(
        (tagging) => tagging.tagUlid !== ulid || tagging.tagGroupUlid !== props.group.ulid
      )
    } else {
      selectedTaggings.value.push({ tagUlid: ulid, tagGroupUlid: props.group.ulid })
    }
  }

  const isSelected = (ulid: string) => {
    return selectedTaggings.value.some(
      (tagging) => tagging.tagUlid === ulid && tagging.tagGroupUlid === props.group.ulid
    )
  }

  const selectedTagsInGroup = computed(() => {
    return (
      props.group.tags?.filter((tag) =>
        selectedTaggings.value.some(
          (tagging) => tagging.tagUlid === tag.ulid && tagging.tagGroupUlid === props.group.ulid
        )
      ) ?? []
    )
  })
</script>

<template>
  <StoriesFilterBarPanel :pt="props.pt">
    <template #header>
      <div class="flex w-full items-center justify-between">
        <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">{{ props.group.name }}</p>
        <Badge
          v-if="selectedTagsInGroup.length > 0"
          :value="selectedTagsInGroup.length"
          class="!rounded-full"
          size="small"></Badge>
      </div>
    </template>
    <div class="flex flex-wrap gap-2">
      <Tag
        v-for="tag in props.group.tags"
        :key="tag.ulid"
        :class="{ unselected: !isSelected(tag.ulid) }"
        :value="tag.name"
        rounded
        @click="handleClickTag(tag.ulid)"></Tag>
    </div>
  </StoriesFilterBarPanel>
</template>

<style scoped>
  @reference "../assets/main.css";
  :deep(.p-tag .p-tag-label) {
    @apply font-bold leading-[0.875rem];
  }

  :deep(.p-tag) {
    @apply cursor-pointer border border-transparent;
  }

  :deep(.p-tag.unselected) {
    @apply bg-gray-100 hover:border hover:border-blue-600 hover:bg-blue-50;
  }

  :deep(.p-tag.unselected .p-tag-label) {
    @apply text-gray-700 hover:text-blue-600;
  }
</style>
