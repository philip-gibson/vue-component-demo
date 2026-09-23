export interface SelectOption {
  label: string
  value: string
}

export interface SelectOptionGroup {
  label: string
  labelPrefix: string
  items: SelectOption[]
}

export interface Event {
  ulid: string 
  userId: string
  title: string
  content: string
  contentPlain: string
  eventDate: Date
  rating: RatingValue
  authorName: string
  eventTypes?: EventType[]
  createdAt: Date
  updatedAt: Date
}

export interface EventCreateParams {
  title: string
  content: string
  notes?: string
  eventTypeUlids: string[]
  eventDate?: Date
  rating: RatingValue
}

export interface EventUpdateParams {
  ulid: string
  title: string
  content: string
  notes?: string
  eventTypeUlids: string[]
  eventDate?: Date
  rating: RatingValue
}

export interface EventFilters {
  search?: string
  sort?: EventSortValue
  creatorIds?: string[]
  eventDateStart?: Date
  eventDateEnd?: Date
  ratings?: RatingValue[]
  eventTypeUlids?: string[]
}

export const EVENT_SORT_VALUES = [
  'event_date_desc',
  'event_date_asc',
  'added_date_desc',
  'added_date_asc',
  'title_asc',
  'title_desc',
] as const

export type EventSortValue = (typeof EVENT_SORT_VALUES)[number]

export interface EventSortOption {
  groupLabel: 'DATE' | 'ADDED DATE' | 'TITLE'
  groupPrefix: 'Date' | 'Added date' | 'Title'
  label: 'Newest first' | 'Oldest first' | 'A to Z' | 'Z to A'
  value: EventSortValue
}

export const EVENT_SORT_OPTIONS: EventSortOption[] = [
  { groupLabel: 'DATE', groupPrefix: 'Date', label: 'Newest first', value: 'event_date_desc' },
  { groupLabel: 'DATE', groupPrefix: 'Date', label: 'Oldest first', value: 'event_date_asc' },
  { groupLabel: 'ADDED DATE', groupPrefix: 'Added date', label: 'Newest first', value: 'added_date_desc' },
  { groupLabel: 'ADDED DATE', groupPrefix: 'Added date', label: 'Oldest first', value: 'added_date_asc' },
  { groupLabel: 'TITLE', groupPrefix: 'Title', label: 'A to Z', value: 'title_asc' },
  { groupLabel: 'TITLE', groupPrefix: 'Title', label: 'Z to A', value: 'title_desc' },
]

export const DEFAULT_EVENT_SORT: EventSortValue = 'added_date_desc'

export const EVENT_SORT_LABEL_BY_VALUE: Record<EventSortValue, string> = EVENT_SORT_OPTIONS.reduce(
  (acc, option) => {
    acc[option.value] = `${option.groupPrefix}: ${option.label}`
    return acc
  },
  {} as Record<EventSortValue, string>
)

export interface EventCreator {
  id: string
  fullName: string
}

export type RatingValue = 'none' | 'awful' | 'bad' | 'neutral' | 'good' | 'great'

type RatingLabel = 'Not Rated' | '1 Star' | '2 Star' | '3 Star' | '4 Star' | '5 Star'
export interface Rating {
  label: RatingLabel
  value: RatingValue
}

export const RATINGS: Rating[] = [
  { label: 'Not Rated', value: 'none' },
  { label: '1 Star', value: 'awful' },
  { label: '2 Star', value: 'bad' },
  { label: '3 Star', value: 'neutral' },
  { label: '4 Star', value: 'good' },
  { label: '5 Star', value: 'great' },
] as const

export type EventType = {
  id: string
  name: string
  ulid: string
  tags?: string[]
  description?: string
}
