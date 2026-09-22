import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useResourceStories } from '@/composables/useResourceStories'
import type {
  BulkStoryUpdateParams,
  BulkUpdateTaggingsParams,
  Story,
  StoryCreateParams,
  StoryFilters,
  StoryUpdateParams,
} from '@/components/types'

export const useStoriesStore = defineStore('stories', () => {
  const STORIES_PAGE_SIZE = 36
  const storiesList = ref<Story[]>()
  const hasMore = ref(false)
  const nextCursor = ref<string | null>(null)
  const loadingMore = ref(false)
  const filters = ref<StoryFilters>({})
  const showStoryForm = ref(false)
  const showBulkUpload = ref(false)
  const showStoryCardExpanded = ref(false)
  const showBulkEditTagsDrawer = ref(false)
  const selectedStoryIds = ref<string[]>([])

  const isBulkSelectMode = computed(() => selectedStoryIds.value.length > 0)
  const hasAppliedFilterParams = computed(() => Object.keys(filters.value).some((key) => key !== 'sort'))

  const showZeroState = computed(() => {
    return storiesList.value?.length === 0 && !hasAppliedFilterParams.value && !loading.value && !loadingMore.value
  })

  const showStories = computed(() => {
    return storiesList.value && storiesList.value.length > 0
  })

  const showNoSearchResults = computed(() => {
    return storiesList.value?.length === 0 && hasAppliedFilterParams.value && !loading.value && !loadingMore.value
  })

  const {
    loading,
    currentStory,
    allStoriesCount,
    filteredStoriesCount,
    bulkUploadStories,
    bulkUpdateStories: bulkUpdateStoriesApi,
    bulkUpdateTaggings: bulkUpdateTaggingsApi,
    fetchBulkPrograms,
    fetchBulkTaggings,
    createStory: createStoryApi,
    deleteStories,
    fetchStory,
    fetchStories,
    fetchStoryIds,
    fetchCreators,
    updateStory,
    addTagToStory,
    removeTagFromStory,
    updateTagGroupTaggings: updateTagGroupTaggingsApi,
    removeTagGroupTaggings: removeTagGroupTaggingsApi,
  } = useResourceStories()

  const allFilteredStoriesSelected = computed(
    () => filteredStoriesCount.value > 0 && selectedStoryIds.value.length >= filteredStoriesCount.value
  )

  const loadStories = async (limit: number = STORIES_PAGE_SIZE) => {
    try {
      const { stories, pagination } = await fetchStories(undefined, limit, filters.value)
      storiesList.value = stories
      hasMore.value = pagination.hasMore
      nextCursor.value = pagination.nextCursor
      selectedStoryIds.value = []
    } catch (error) {
      storiesList.value = []
      hasMore.value = false
      nextCursor.value = null
      selectedStoryIds.value = []
    }
  }

  const loadMore = async () => {
    if (loadingMore.value || loading.value || !hasMore.value || !nextCursor.value) {
      return
    }

    loadingMore.value = true

    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const { stories, pagination } = await fetchStories(nextCursor.value, STORIES_PAGE_SIZE, filters.value)
      storiesList.value ??= []
      storiesList.value.push(...stories)
      hasMore.value = pagination.hasMore
      nextCursor.value = pagination.nextCursor
    } catch (error) {
      console.error('Failed to load more stories:', error)
    } finally {
      loadingMore.value = false
    }
  }

  const createStory = async (params: StoryCreateParams) => {
    const newStory = await createStoryApi(params)
    const currentLoadedCount = Math.max(STORIES_PAGE_SIZE, storiesList.value?.length ?? 0)
    await loadStories(currentLoadedCount)
    return newStory
  }

  const editStory = async (params: StoryUpdateParams) => {
    await updateStory(params)
    await loadStories()
  }

  const removeStories = async (ulids: string[]) => {
    await deleteStories(ulids)
    const currentLoadedCount = Math.max(STORIES_PAGE_SIZE, storiesList.value?.length ?? 0)
    await loadStories(currentLoadedCount)
  }

  const bulkUpdateStories = async (params: BulkStoryUpdateParams) => {
    await bulkUpdateStoriesApi(params)
    await loadStories()
  }

  const bulkUpdateTaggings = async (params: BulkUpdateTaggingsParams) => {
    await bulkUpdateTaggingsApi(params)
    await loadStories()
  }

  const selectAllFiltered = async () => {
    const ulids = await fetchStoryIds(filters.value)
    selectedStoryIds.value = ulids
  }

  const exitBulkMode = () => {
    selectedStoryIds.value = []
  }

  const setFilters = async (newFilters: StoryFilters) => {
    filters.value = { ...newFilters }
    nextCursor.value = null
    hasMore.value = false
    await loadStories()
  }

  const clearFilters = async () => {
    filters.value = {}
    nextCursor.value = null
    hasMore.value = false
    await loadStories()
  }

  const addTag = async (storyUlid: string, tagName: string, tagGroupUlid?: string) => {
    try {
      const updatedStory = await addTagToStory(storyUlid, tagName, tagGroupUlid)
      const index = storiesList.value ? storiesList.value.findIndex((s) => s.ulid === storyUlid) : -1
      if (index !== -1) {
        storiesList.value![index!] = updatedStory
      }
      if (currentStory.value?.ulid === storyUlid) {
        currentStory.value = updatedStory
      }
      return updatedStory
    } catch (error) {
      throw error
    }
  }

  const removeTag = async (storyUlid: string, tagUlid: string) => {
    try {
      await removeTagFromStory(storyUlid, tagUlid)
      await loadStories()
    } catch (error) {
      throw error
    }
  }

  const updateTagGroupTaggings = async (storyUlid: string, tagGroupUlid: string | null, tagUlids: string[]) => {
    try {
      const updatedStory = await updateTagGroupTaggingsApi(storyUlid, tagGroupUlid, tagUlids)
      const index = storiesList.value ? storiesList.value.findIndex((s) => s.ulid === storyUlid) : -1
      if (index !== -1) {
        storiesList.value![index] = updatedStory
      }
      if (currentStory.value?.ulid === storyUlid) {
        currentStory.value = updatedStory
      }
      return updatedStory
    } catch (error) {
      throw error
    }
  }

  const removeTagGroup = async (storyUlid: string, tagGroupUlid: string | null) => {
    try {
      await removeTagGroupTaggingsApi(storyUlid, tagGroupUlid)
      await fetchStory(storyUlid)
    } catch (error) {
      throw error
    }
  }

  const $reset = () => {
    storiesList.value = undefined
    hasMore.value = false
    nextCursor.value = null
    loadingMore.value = false
    selectedStoryIds.value = []
    currentStory.value = undefined
    filters.value = {}
  }

  return {
    stories: storiesList,
    selectedStoryIds,
    allFilteredStoriesSelected,
    isBulkSelectMode,
    currentStory,
    allStoriesCount,
    filteredStoriesCount,
    loading,
    loadingMore,
    hasMore,
    filters,
    showStoryForm,
    showBulkUpload,
    showZeroState,
    showStories,
    showNoSearchResults,
    showStoryCardExpanded,
    showBulkEditTagsDrawer,
    loadStories,
    loadMore,
    editStory,
    removeStories,
    bulkUpdateStories,
    bulkUpdateTaggings,
    fetchBulkPrograms,
    fetchBulkTaggings,
    bulkUploadStories,
    createStory,
    fetchStory,
    fetchCreators,
    fetchStories: loadStories,
    setFilters,
    clearFilters,
    addTag,
    removeTag,
    updateTagGroupTaggings,
    removeTagGroup,
    selectAllFiltered,
    exitBulkMode,
    $reset,
  }
})
