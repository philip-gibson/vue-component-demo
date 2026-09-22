import { useDebounceFn } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useProgramsStore } from '@/stores/programs'
import { useStoriesStore } from '@/stores/stories'
import { useTagGroupsStore } from '@/stores/tagGroups'
import {
  DEFAULT_STORY_SORT,
  type FilterTagging,
  type SentimentValue,
  type StoryCreator,
  type StoryFilters,
  type StorySortValue,
} from '@/components/types'

export const useStoriesFilterStore = defineStore('storiesFilter', () => {
  const storiesStore = useStoriesStore()

  const creators = ref<StoryCreator[]>([])
  const loadingCreators = ref(false)
  const searchQuery = ref('')
  const selectedCreators = ref<number[]>([])
  const createdDateRange = ref<Date[]>()
  const storyDateRange = ref<Date[]>()
  const selectedSentiments = ref<SentimentValue[]>([])
  const selectedPrograms = ref<string[]>([])
  const selectedTaggings = ref<FilterTagging[]>([])
  const selectedSort = ref<StorySortValue>(DEFAULT_STORY_SORT)

  const { selectOptionPrograms } = storeToRefs(useProgramsStore())

  const { tagGroups, ungroupedTags } = storeToRefs(useTagGroupsStore())

  const filterTagGroups = computed(() => {
    if (!tagGroups.value) return []
    if (!ungroupedTags.value) return []
    return [...tagGroups.value, { name: 'Ungrouped', ulid: 'ungrouped', tags: ungroupedTags.value }]
  })

  const normalizedSearchQuery = computed(() => searchQuery.value.trim())
  const appliedSearchQuery = computed(() =>
    normalizedSearchQuery.value.length >= 2 ? normalizedSearchQuery.value : undefined
  )

  const hasActiveFilters = computed(() => {
    return !!(
      appliedSearchQuery.value ||
      selectedCreators.value.length > 0 ||
      createdDateRange.value ||
      storyDateRange.value ||
      selectedSentiments.value.length > 0 ||
      selectedPrograms.value.length > 0 ||
      selectedTaggings.value.length > 0
    )
  })

  const hasClearableFilters = computed(() => hasActiveFilters.value)

  const filters = computed(() => {
    const filters: StoryFilters = {}

    if (appliedSearchQuery.value) {
      filters.search = appliedSearchQuery.value
    }
    if (selectedCreators.value.length > 0) {
      filters.creatorIds = selectedCreators.value
    }
    if (createdDateRange.value && createdDateRange.value.length > 0) {
      filters.createdStart = createdDateRange.value[0]
      filters.createdEnd = createdDateRange.value[1] || createdDateRange.value[0]
    }
    if (storyDateRange.value && storyDateRange.value.length > 0) {
      filters.storyDateStart = storyDateRange.value[0]
      filters.storyDateEnd = storyDateRange.value[1] || storyDateRange.value[0]
    }
    if (selectedSentiments.value.length > 0) {
      filters.sentiments = selectedSentiments.value
    }
    if (selectedPrograms.value.length > 0) {
      filters.programUlids = selectedPrograms.value
    }
    if (selectedTaggings.value.length > 0) {
      filters.taggings = selectedTaggings.value
    }
    filters.sort = selectedSort.value
    return filters
  })

  const applyFilters = useDebounceFn(() => storiesStore.setFilters(filters.value), 360)

  watch(
    [
      appliedSearchQuery,
      selectedCreators,
      createdDateRange,
      storyDateRange,
      selectedSentiments,
      selectedPrograms,
      selectedTaggings,
    ],
    () => applyFilters(),
    { deep: true }
  )

  const loadCreators = async () => {
    loadingCreators.value = true
    try {
      creators.value = await storiesStore.fetchCreators()
    } catch (error) {
      console.error('Failed to load creators:', error)
    } finally {
      loadingCreators.value = false
    }
  }

  const clearFilters = async () => {
    if (appliedSearchQuery.value) {
      searchQuery.value = ''
    }
    selectedCreators.value = []
    createdDateRange.value = undefined
    storyDateRange.value = undefined
    selectedSentiments.value = []
    selectedPrograms.value = []
    selectedTaggings.value = []
    selectedSort.value = DEFAULT_STORY_SORT
  }

  const setSort = async (sort: StorySortValue) => {
    if (selectedSort.value === sort) return
    selectedSort.value = sort
    await storiesStore.setFilters(filters.value)
  }

  const $reset = () => {
    creators.value = []
    loadingCreators.value = false
    searchQuery.value = ''
    selectedCreators.value = []
    createdDateRange.value = undefined
    storyDateRange.value = undefined
    selectedSentiments.value = []
    selectedPrograms.value = []
    selectedTaggings.value = []
    selectedSort.value = DEFAULT_STORY_SORT
  }

  return {
    creators,
    filterTagGroups,
    selectOptionPrograms,
    loadingCreators,
    searchQuery,
    selectedCreators,
    createdDateRange,
    storyDateRange,
    selectedSentiments,
    selectedPrograms,
    selectedTaggings,
    selectedSort,
    hasActiveFilters,
    hasClearableFilters,
    loadCreators,
    clearFilters,
    setSort,
    $reset,
  }
})
