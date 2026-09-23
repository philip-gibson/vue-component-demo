import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  Event,
  EventCreateParams,
  EventFilters,
  EventUpdateParams,
} from '@/components/types'
import { useQueryEvents } from '@/composables/useQueryEvents'

export const useEventsStore = defineStore('events', () => {
  const currentEvent = ref<Event>()
  const filters = ref<EventFilters>({})
  const showEventForm = ref(false)
  const showEventCardExpanded = ref(false)
  const selectedEventIds = ref<string[]>([])

  const { events, allEventsCount, filteredEventsCount, loading } = useQueryEvents(filters)

  const hasAppliedFilterParams = computed(() => Object.keys(filters.value).some((key) => key !== 'sort'))

  const showZeroState = computed(() => {
    return events.value?.length === 0 && !hasAppliedFilterParams.value
  })

  const showEvents = computed(() => {
    return events.value && events.value.length > 0
  })

  const showNoSearchResults = computed(() => {
    return events.value?.length === 0 && hasAppliedFilterParams.value
  })

  const createEvent = async (params: EventCreateParams) => {}

  const editEvent = async (params: EventUpdateParams) => {}

  const removeEvents = async (ulids: string[]) => {}

  const setFilters = async (newFilters: EventFilters) => {
    filters.value = { ...newFilters }
  }

  const clearFilters = async () => {
    filters.value = {}
  }

  const $reset = () => {
    events.value = undefined
    selectedEventIds.value = []
    currentEvent.value = undefined
    filters.value = {}
  }

  return {
    events,
    allEventsCount,
    filteredEventsCount,
    loading,
    selectedEventIds,
    currentEvent,
    filters,
    showEventForm,
    showZeroState,
    showEvents,
    showNoSearchResults,
    showEventCardExpanded,
    editEvent,
    removeEvents,
    createEvent,
    setFilters,
    clearFilters,
    $reset,
  }
})
