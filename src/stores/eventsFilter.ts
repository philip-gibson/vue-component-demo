import { useDebounceFn } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useEventTypesStore } from '@/stores/eventTypes'
import { useEventsStore } from '@/stores/events'
import {
  DEFAULT_EVENT_SORT,
  type RatingValue,
  type EventCreator,
  type EventFilters,
  type EventSortValue,
} from '@/components/types'
import { eventCreatorsList } from '@/utils/mockData'

export const useEventsFilterStore = defineStore('eventsFilter', () => {
  const eventsStore = useEventsStore()
  const creators = ref<EventCreator[]>(eventCreatorsList)
  const loadingCreators = ref(false)
  const searchQuery = ref('')
  const selectedCreators = ref<string[]>([])
  const createdDateRange = ref<Date[]>()
  const eventDateRange = ref<Date[]>()
  const selectedRatings = ref<RatingValue[]>([])
  const selectedEventTypes = ref<string[]>([])
  const selectedSort = ref<EventSortValue>(DEFAULT_EVENT_SORT)

  const { selectOptionEventTypes } = storeToRefs(useEventTypesStore())

  const normalizedSearchQuery = computed(() => searchQuery.value.trim())
  const appliedSearchQuery = computed(() =>
    normalizedSearchQuery.value.length >= 2 ? normalizedSearchQuery.value : undefined
  )

  const hasActiveFilters = computed(() => {
    return !!(
      appliedSearchQuery.value ||
      selectedCreators.value.length > 0 ||
      createdDateRange.value ||
      eventDateRange.value ||
      selectedRatings.value.length > 0 ||
      selectedEventTypes.value.length > 0
    )
  })

  const hasClearableFilters = computed(() => hasActiveFilters.value)

  const filters = computed(() => {
    const filters: EventFilters = {}

    if (appliedSearchQuery.value) {
      filters.search = appliedSearchQuery.value
    }
    if (selectedCreators.value.length > 0) {
      filters.creatorIds = selectedCreators.value
    }
    if (eventDateRange.value && eventDateRange.value.length > 0) {
      filters.eventDateStart = eventDateRange.value[0]
      filters.eventDateEnd = eventDateRange.value[1] || eventDateRange.value[0]
    }
    if (selectedRatings.value.length > 0) {
      filters.ratings = selectedRatings.value
    }
    if (selectedEventTypes.value.length > 0) {
      filters.eventTypeUlids = selectedEventTypes.value
    }
    filters.sort = selectedSort.value
    return filters
  })

  const applyFilters = useDebounceFn(() => eventsStore.setFilters(filters.value), 360)

  watch(
    [
      appliedSearchQuery,
      selectedCreators,
      createdDateRange,
      eventDateRange,
      selectedRatings,
      selectedEventTypes,
    ],
    () => applyFilters(),
    { deep: true }
  )

  const clearFilters = async () => {
    if (appliedSearchQuery.value) {
      searchQuery.value = ''
    }
    selectedCreators.value = []
    createdDateRange.value = undefined
    eventDateRange.value = undefined
    selectedRatings.value = []
    selectedEventTypes.value = []
    selectedSort.value = DEFAULT_EVENT_SORT
  }

  const setSort = async (sort: EventSortValue) => {
    if (selectedSort.value === sort) return
    selectedSort.value = sort
    await eventsStore.setFilters(filters.value)
  }

  const $reset = () => {
    creators.value = []
    loadingCreators.value = false
    searchQuery.value = ''
    selectedCreators.value = []
    createdDateRange.value = undefined
    eventDateRange.value = undefined
    selectedRatings.value = []
    selectedEventTypes.value = []
    selectedSort.value = DEFAULT_EVENT_SORT
  }

  return {
    creators,
    selectOptionEventTypes,
    loadingCreators,
    searchQuery,
    selectedCreators,
    createdDateRange,
    eventDateRange,
    selectedRatings,
    selectedEventTypes,
    selectedSort,
    hasActiveFilters,
    hasClearableFilters,
    clearFilters,
    setSort,
    $reset,
  }
})
