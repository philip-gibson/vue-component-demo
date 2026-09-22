export interface SelectOption {
  label: string
  value: string
}

export interface SelectOptionGroup {
  label: string
  labelPrefix: string
  items: SelectOption[]
}

export type Tag = {
  id: number
  ulid: string
  name: string
  category: string
  groupName?: string
  groupUlid?: string
  tagGroups?: TagGroupReference[]
  storiesCount?: number
}

export type TagGroupReference = {
  ulid: string
  name: string
}

export type TagGroup = {
  ulid: string
  name: string
  createdAt?: Date
  storiesCount?: number
  tags: Tag[]
}

export type TagGroupsResponse = {
  tagGroups: TagGroup[]
  ungroupedTags: Tag[]
}

export type Tagging = {
  ulid: string
  tag: {
    ulid: string
    name: string
    category: string
  }
  tagGroup: {
    ulid: string
    name: string
  } | null
}

export const TagGroupSortOption = {
  CREATED_AT_DESC: 'created_at_desc',
  CREATED_AT_ASC: 'created_at_asc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  TAG_COUNT_DESC: 'tag_count_desc',
  TAG_COUNT_ASC: 'tag_count_asc',
} as const

export const STORY_CONTENT_TYPES = ['article', 'interview', 'blog_post', 'report', 'other'] as const

export type StoryContentTypeValue = (typeof STORY_CONTENT_TYPES)[number]

export interface StoryContentType {
  label: string
  value: StoryContentTypeValue
}

export const STORY_CONTENT_TYPE_OPTIONS: StoryContentType[] = [
  { label: 'ARTICLE', value: 'article' },
  { label: 'INTERVIEW', value: 'interview' },
  { label: 'BLOG POST', value: 'blog_post' },
  { label: 'REPORT', value: 'report' },
  { label: 'OTHER', value: 'other' },
]

export const STORY_CONTENT_TYPE_LABELS: Record<StoryContentTypeValue, string> = {
  article: 'ARTICLE',
  interview: 'INTERVIEW',
  blog_post: 'BLOG POST',
  report: 'REPORT',
  other: 'OTHER',
}

export const DEFAULT_STORY_CONTENT_TYPE: StoryContentTypeValue = 'other'

export const parseStoryContentType = (contentType: string | null | undefined): StoryContentTypeValue => {
  if (!contentType) return DEFAULT_STORY_CONTENT_TYPE
  const normalizedValue = contentType.toLowerCase() as StoryContentTypeValue
  if (STORY_CONTENT_TYPES.includes(normalizedValue)) return normalizedValue
  return DEFAULT_STORY_CONTENT_TYPE
}

export const formatStoryContentTypeLabel = (contentType: string | null | undefined): string => {
  return STORY_CONTENT_TYPE_LABELS[parseStoryContentType(contentType)]
}

export interface StoryAttachment {
  ulid: string
  filename: string
  contentType: string
  byteSize: number
  url: string // Signed URL from ActiveStorage
  createdAt: Date
}

export interface StoryLink {
  ulid: string
  url: string
  title?: string
  primary?: boolean
  createdAt: Date
}

export interface StoryLinkUpdateParams {
  url?: string
  title?: string
  primary?: boolean
}

export interface Story {
  ulid: string // ULID - use this for all references, keys, and API calls
  userId: number | null // NULLABLE - can be null if user deleted
  organizationId: number // REQUIRED - always present
  title: string
  content: string // HTML string
  contentPlain: string
  contentType: StoryContentTypeValue
  notes?: string
  storyDate: Date
  sentiment: SentimentValue
  authorName: string // Helper from backend for displaying author
  attachments?: StoryAttachment[]
  links?: StoryLink[]
  programs?: { name: string; ulid: string }[]
  taggings?: Tagging[]
  createdAt: Date
  updatedAt: Date
}

export interface StoryCreateParams {
  title: string
  content: string
  contentType: StoryContentTypeValue
  notes?: string
  programUlids: string[]
  storyDate?: Date
  sentiment: SentimentValue
  storyTaggings?: { tagName: string; tagGroupUlid?: string }[]
  links?: StoryLinkCreateParams[]
  signedBlobIds?: string[]
}

export interface StoryUpdateParams {
  ulid: string
  title?: string
  content?: string
  contentType?: StoryContentTypeValue
  notes?: string
  programUlids?: string[]
  storyDate?: Date
  sentiment?: SentimentValue
}

export interface BulkStoryUpdateParams {
  ulids: string[]
  contentType?: StoryContentTypeValue
  storyDate?: Date
  sentiment?: SentimentValue
  addProgramUlids?: string[]
  removeProgramUlids?: string[]
}

export interface StoryLinkCreateParams {
  url: string
  title?: string
  primary?: boolean
}

export interface PaginationMetadata {
  hasMore: boolean
  nextCursor: string | null
  limit: number
}

export interface StoryFilters {
  search?: string
  sort?: StorySortValue
  creatorIds?: number[]
  createdStart?: Date
  createdEnd?: Date
  storyDateStart?: Date
  storyDateEnd?: Date
  sentiments?: SentimentValue[]
  programUlids?: string[]
  taggings?: FilterTagging[]
}

export const STORY_SORT_VALUES = [
  'story_date_desc',
  'story_date_asc',
  'added_date_desc',
  'added_date_asc',
  'title_asc',
  'title_desc',
] as const

export type StorySortValue = (typeof STORY_SORT_VALUES)[number]

export interface StorySortOption {
  groupLabel: 'DATE' | 'ADDED DATE' | 'TITLE'
  groupPrefix: 'Date' | 'Added date' | 'Title'
  label: 'Newest first' | 'Oldest first' | 'A to Z' | 'Z to A'
  value: StorySortValue
}

export const STORY_SORT_OPTIONS: StorySortOption[] = [
  { groupLabel: 'DATE', groupPrefix: 'Date', label: 'Newest first', value: 'story_date_desc' },
  { groupLabel: 'DATE', groupPrefix: 'Date', label: 'Oldest first', value: 'story_date_asc' },
  { groupLabel: 'ADDED DATE', groupPrefix: 'Added date', label: 'Newest first', value: 'added_date_desc' },
  { groupLabel: 'ADDED DATE', groupPrefix: 'Added date', label: 'Oldest first', value: 'added_date_asc' },
  { groupLabel: 'TITLE', groupPrefix: 'Title', label: 'A to Z', value: 'title_asc' },
  { groupLabel: 'TITLE', groupPrefix: 'Title', label: 'Z to A', value: 'title_desc' },
]

export const DEFAULT_STORY_SORT: StorySortValue = 'added_date_desc'

export const STORY_SORT_LABEL_BY_VALUE: Record<StorySortValue, string> = STORY_SORT_OPTIONS.reduce(
  (acc, option) => {
    acc[option.value] = `${option.groupPrefix}: ${option.label}`
    return acc
  },
  {} as Record<StorySortValue, string>
)

export interface FilterTagging {
  tagUlid: string
  tagGroupUlid: string | null
}

export interface BulkUpdateTagging {
  tagUlid: string
  tagGroupUlid: string | null
}

export interface BulkUpdateTaggingsParams {
  ulids: string[]
  addTaggings: BulkUpdateTagging[] | null
  removeTaggings: BulkUpdateTagging[] | null
}

export interface StoryCreator {
  id: number
  fullName: string
}

export type SentimentValue = 'none' | 'awful' | 'bad' | 'neutral' | 'good' | 'great'

type SentimentLabel = 'None' | 'Awful' | 'Bad' | 'Neutral' | 'Good' | 'Great'
export interface Sentiment {
  label: SentimentLabel
  value: SentimentValue
}

export const SENTIMENTS: Sentiment[] = [
  { label: 'None', value: 'none' },
  { label: 'Awful', value: 'awful' },
  { label: 'Bad', value: 'bad' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Good', value: 'good' },
  { label: 'Great', value: 'great' },
] as const

export type Program = {
  id: string
  name: string
  organizationId: string
  slug: string
  ulid: string
  tags: string[]
  description?: string
  createdAt: string
  updatedAt: string
  reports?: Report[]
}
