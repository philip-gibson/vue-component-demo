import { type Ref, ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import type {
  Event,
  EventFilters,
  EventSortValue,
} from '@/components/types'
import { eventsList } from '@/utils/mockData'

const isSameDayOrAfter = (date: Date, start: Date) => date.getTime() >= start.getTime()

const isSameDayOrBefore = (date: Date, end: Date) => date.getTime() <= end.getTime()

/**
 * Date pickers usually emit midnight for the selected day. When the range end
 * falls exactly on midnight, extend it to the end of that day so events
 * created/dated during the day are still included.
 */
const normalizeRangeEnd = (end: Date) => {
  const normalized = new Date(end)
  if (
    normalized.getHours() === 0 &&
    normalized.getMinutes() === 0 &&
    normalized.getSeconds() === 0 &&
    normalized.getMilliseconds() === 0
  ) {
    normalized.setHours(23, 59, 59, 999)
  }
  return normalized
}

const matchesSearch = (event: Event, search: string) => {
  const query = search.toLowerCase()
  return (
    event.title.toLowerCase().includes(query) ||
    event.authorName.toLowerCase().includes(query) ||
    event.contentPlain.toLowerCase().includes(query)
  )
}

const sortEvents = (events: Event[], sort: EventSortValue): Event[] => {
  const sorted = [...events]

  switch (sort) {
    case 'event_date_desc':
      return sorted.sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime())
    case 'event_date_asc':
      return sorted.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
    case 'added_date_desc':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'added_date_asc':
      return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return sorted
  }
}

export const useQueryEvents = (filters: Ref<EventFilters>) => {
  const events = ref<Event[]>()
  const allEventsCount = ref<number>()
  const filteredEventsCount = ref<number>()
  const loading = ref(false)

  function getEvents() {
    const {
      search,
      creatorIds,
      eventDateStart,
      eventDateEnd,
      ratings,
      eventTypeUlids,
      sort,
    } = filters.value

    let result = eventsList
    allEventsCount.value = eventsList.length
    loading.value = true

    if (search) {
      result = result.filter((event) => matchesSearch(event, search))
    }

    if (creatorIds && creatorIds.length > 0) {
      result = result.filter((event) => creatorIds.includes(event.userId))
    }

    if (eventDateStart) {
      const start = new Date(eventDateStart)
      result = result.filter((event) => isSameDayOrAfter(event.eventDate, start))
    }

    if (eventDateEnd) {
      const end = normalizeRangeEnd(eventDateEnd)
      result = result.filter((event) => isSameDayOrBefore(event.eventDate, end))
    }

    if (ratings && ratings.length > 0) {
      result = result.filter((event) => ratings.includes(event.rating))
    }

    if (eventTypeUlids && eventTypeUlids.length > 0) {
      result = result.filter((event) =>
        event.eventTypes?.some((eventType) => eventTypeUlids.includes(eventType.ulid))
      )
    }

    // NOTE: the `taggings` filter is not applied yet because `Event` has no
    // tagging information in the current data model. Add it here once events
    // expose their taggings.

    if (sort) {
      result = sortEvents(result, sort)
    }

    setTimeout(() => {
      events.value = result
      filteredEventsCount.value = result.length
      loading.value = false
    }, 500)
  }

  watchImmediate(filters, () => {
    getEvents()
  })

  return {
    events,
    allEventsCount,
    filteredEventsCount,
    loading,
  }
}
