<script lang="ts" setup>
  import Card from 'primevue/card'
  import Checkbox from 'primevue/checkbox'
  import { computed } from 'vue'
  import { useStoriesStore } from '@/stores/stories'
  import { type Story, formatStoryContentTypeLabel } from '@/components/types'
  import { formatDate } from '@/utils/formatDate'
  import ProgramTags from './ProgramTags.vue'

  const props = defineProps<{
    story: Story
  }>()

  const storiesStore = useStoriesStore()

  const isSelected = computed(() => storiesStore.selectedStoryIds.includes(props.story.ulid))

  const handleClickCard = async () => {
    if (storiesStore.isBulkSelectMode) {
      const idx = storiesStore.selectedStoryIds.indexOf(props.story.ulid)
      if (idx === -1) {
        storiesStore.selectedStoryIds.push(props.story.ulid)
      } else {
        storiesStore.selectedStoryIds.splice(idx, 1)
      }
      return
    }

    try {
      storiesStore.currentStory = undefined
      await storiesStore.fetchStory(props.story.ulid)
      storiesStore.showStoryCardExpanded = true
    } catch (error) {
      console.error('Error editing story:', error)
    }
  }
</script>

<template>
  <Card
    :pt="{
      body: '!p-8 max-h-[22rem]',
      content: 'p-0',
      root: isSelected ? '!shadow-none' : '',
    }"
    :class="[
      'group/storyCard flex-auto transition-colors duration-300 ease-out hover:cursor-pointer',
      isSelected ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-white hover:bg-blue-25',
    ]"
    @click="handleClickCard">
    <template #content>
      <div class="flex h-[16.5rem] flex-col justify-start">
        <div class="flex items-center justify-between">
          <p class="story-type">{{ formatStoryContentTypeLabel(story.contentType) }}</p>
          <Checkbox
            v-model="storiesStore.selectedStoryIds"
            :input-id="story.ulid"
            :value="story.ulid"
            :class="[
              'transition-opacity duration-300 ease-out',
              isSelected || storiesStore.isBulkSelectMode
                ? 'opacity-100'
                : 'opacity-0 group-hover/storyCard:opacity-100',
            ]"
            @click.stop />
        </div>
        <h3 v-if="story.title" class="title text-lg font-semibold text-gray-900" :title="story.title">
          {{ story.title }}
        </h3>

        <div class="mb-4 mt-2">
          <p class="story-date">
            <span class="font-[Inter] text-base text-[#64748B]" style="font-size: 12px; line-height: normal">{{
              formatDate(story.storyDate, 'MMM DD, YYYY')
            }}</span>
          </p>
        </div>

        <div
          v-if="story.contentPlain"
          ref="contentRef"
          class="story-content min-h-0 flex-1">
          {{ story.contentPlain }}
        </div>
        <ProgramTags :programs="story.programs" class="mt-auto shrink-0" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
  @reference "../assets/main.css";
  .story-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
    color: #6b7280;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  h3.title {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 90px;
    color: var(--card-color, #334155);
    font-size: 20px;
    font-style: normal;
    font-weight: var(--card-title-font-weight, 500);
    line-height: 150%;
  }

  .story-date span {
    color: var(--card-subtitle-color, #64748b);
    font-size: 12px;
    line-height: normal;
  }

  .story-type {
    color: #64748b;
    font-size: 12px;
    letter-spacing: 0.18em;
    margin-bottom: 8px;
  }
</style>
