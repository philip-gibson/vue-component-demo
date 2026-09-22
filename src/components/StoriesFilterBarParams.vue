<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import Chip from 'primevue/chip'
  import { computed } from 'vue'
  import { useStoriesFilterStore } from '@/stores/storiesFilter'
  import { useTagGroupsStore } from '@/stores/tagGroups'
  import { type FilterTagging, SENTIMENTS } from '@/components/types'
  import { formatDateRange } from '@/utils/formatDate'

  const tagGroupsStore = useTagGroupsStore()
  const filterStore = useStoriesFilterStore()
  const {
    selectedPrograms,
    selectedSentiments,
    storyDateRange,
    selectedCreators,
    createdDateRange,
    selectedTaggings,
    searchQuery,
  } = storeToRefs(filterStore)
  const SEARCH_CHIP_MAX_LENGTH = 20

  const getProgramLabel = (programUlid: string) => {
    const program = filterStore.selectOptionPrograms.find((p) => p.ulid === programUlid)
    return program ? program.label : 'Unknown Program'
  }

  const removeProgram = (programUlid: string) => {
    selectedPrograms.value = selectedPrograms.value.filter((id) => id !== programUlid)
  }

  const getSentimentLabel = (sentimentValue: string) => {
    const sentiment = SENTIMENTS.find((s) => s.value === sentimentValue)
    return sentiment ? sentiment.label : 'Unknown Sentiment'
  }

  const removeSentiment = (sentiment: string) => {
    selectedSentiments.value = selectedSentiments.value.filter((s) => s !== sentiment)
  }

  const removeStoryDateRange = () => {
    storyDateRange.value = undefined
  }

  const getCreatorLabel = (creatorId: number) => {
    const creator = filterStore.creators.find((c) => c.id === creatorId)
    return creator ? creator.fullName : 'Unknown Creator'
  }

  const removeCreator = (creatorId: number) => {
    selectedCreators.value = selectedCreators.value.filter((id) => id !== creatorId)
  }

  const removeCreatedDateRange = () => {
    createdDateRange.value = undefined
  }

  const getTagLabel = (tagging: FilterTagging) => {
    let tag
    if (tagging.tagGroupUlid === 'ungrouped')
      tag = tagGroupsStore.allTagsAndGroups.find((tag) => tag.ulid === tagging.tagUlid && tag.groupName === 'Ungrouped')
    else
      tag = tagGroupsStore.allTagsAndGroups.find(
        (tag) => tag.ulid === tagging.tagUlid && tag.groupUlid === tagging.tagGroupUlid
      )
    if (!tag) return 'Unknown Tag'
    return tag.groupName === 'Ungrouped' ? tag.name : `${tag.groupName}: ${tag.name}`
  }

  const removeTag = (tagging: FilterTagging) => {
    selectedTaggings.value = selectedTaggings.value.filter(
      (tag) => tag.tagUlid !== tagging.tagUlid || tag.tagGroupUlid !== tagging.tagGroupUlid
    )
  }

  const removeSearch = () => {
    searchQuery.value = ''
  }

  const searchChipText = computed(() => {
    const normalizedSearch = searchQuery.value.trim()
    if (normalizedSearch.length < 2) return ''

    const truncated =
      normalizedSearch.length > SEARCH_CHIP_MAX_LENGTH
        ? `${normalizedSearch.slice(0, SEARCH_CHIP_MAX_LENGTH)}...`
        : normalizedSearch

    return `Search: ${truncated}`
  })

  const dateRangeChipText = computed(() => {
    const dates = storyDateRange.value ?? []
    const text = formatDateRange(dates[0], dates[1])
    return text ? `Date: ${text}` : ''
  })
  const createdDateRangeChipText = computed(() => {
    const dates = createdDateRange.value ?? []
    const text = formatDateRange(dates[0], dates[1])
    return text ? `Added date: ${text}` : ''
  })

  const chipProps = {
    root: '!bg-blue-50 !rounded-xl !px-2 !py-1',
    label: 'text-[12.5px] font-bold !text-blue-700 leading-[0.875rem]',
    removeIcon: '!text-[0.75rem] !text-blue-700 flex items-center justify-center',
  }
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Chip
      v-if="searchChipText"
      :label="searchChipText"
      :pt="chipProps"
      removable
      remove-icon="pi pi-times"
      @remove="removeSearch" />
    <Chip
      v-for="program in selectedPrograms"
      :key="program"
      :label="getProgramLabel(program)"
      :pt="chipProps"
      removable
      remove-icon="pi pi-times"
      @remove="removeProgram(program)" />
    <Chip
      v-for="sentiment in selectedSentiments"
      :key="sentiment"
      :label="getSentimentLabel(sentiment)"
      :pt="chipProps"
      removable
      remove-icon="pi pi-times"
      @remove="removeSentiment(sentiment)" />
    <Chip
      v-if="storyDateRange"
      :label="dateRangeChipText"
      :pt="chipProps"
      removable
      remove-icon="pi pi-times"
      @remove="removeStoryDateRange" />
    <Chip
      v-for="creator in selectedCreators"
      :key="creator"
      :label="getCreatorLabel(creator)"
      :pt="chipProps"
      removable
      remove-icon="pi pi-times"
      @remove="removeCreator(creator)" />
    <Chip
      v-if="createdDateRange"
      :label="createdDateRangeChipText"
      :pt="chipProps"
      removable
      remove-icon="pi pi-times"
      @remove="removeCreatedDateRange" />
    <Chip
      v-for="tagging in selectedTaggings"
      :key="`${tagging.tagUlid}-${tagging.tagGroupUlid}`"
      :label="getTagLabel(tagging)"
      :pt="chipProps"
      removable
      remove-icon="pi pi-times"
      @remove="removeTag(tagging)" />
  </div>
</template>
