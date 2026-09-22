import dayjs from 'dayjs'
import { ref } from 'vue'
import { type AxiosRequestType, useAxios } from '@/composables/useAxios'
import {
  type BulkStoryUpdateParams,
  type BulkUpdateTaggingsParams,
  type PaginationMetadata,
  type Story,
  type StoryCreateParams,
  type StoryCreator,
  type StoryFilters,
  type StoryUpdateParams,
  type TagGroup,
  parseStoryContentType,
} from '@/components/types'

function buildStoryFilterParams(filters?: StoryFilters): Record<string, any> {
  const params: Record<string, any> = {}
  if (filters?.search) params.search = filters.search
  if (filters?.sort) params.sort = filters.sort
  if (filters?.creatorIds) params.creator_ids = filters.creatorIds
  if (filters?.createdStart) params.created_start = dayjs(filters.createdStart).format('YYYY-MM-DD')
  if (filters?.createdEnd) params.created_end = dayjs(filters.createdEnd).format('YYYY-MM-DD')
  if (filters?.storyDateStart) params.story_date_start = dayjs(filters.storyDateStart).format('YYYY-MM-DD')
  if (filters?.storyDateEnd) params.story_date_end = dayjs(filters.storyDateEnd).format('YYYY-MM-DD')
  if (filters?.sentiments) params.sentiments = filters.sentiments
  if (filters?.programUlids) params.program_ulids = filters.programUlids
  if (filters?.taggings) {
    params.taggings = filters.taggings.map((tagging) => ({
      tag_ulid: tagging.tagUlid,
      tag_group_ulid: tagging.tagGroupUlid,
    }))
  }
  return params
}

function formatStoryResponse(story: any): Story {
  return {
    ...story,
    content: story.content ?? '',
    contentPlain: story.contentPlain ?? '',
    contentType: parseStoryContentType(story.contentType),
    storyDate: dayjs(story.storyDate, 'YYYY-MM-DD').toDate(),
    createdAt: dayjs(story.createdAt).toDate(),
    updatedAt: dayjs(story.updatedAt).toDate(),
    attachments:
      story.attachments?.map((a: any) => ({
        ...a,
        createdAt: dayjs(a.createdAt).toDate(),
      })) || [],
    links:
      story.links?.map((l: any) => ({
        ...l,
        createdAt: dayjs(l.createdAt).toDate(),
      })) || [],
  }
}

export function useResourceStories() {
  const allStoriesCount = ref(0)
  const filteredStoriesCount = ref(0)
  const stories = ref<Story[]>([])
  const currentStory = ref<Story>()
  const loading = ref(false)

  const { singleApiRequest } = useAxios()

  const fetchStories = async (cursor?: string, limit: number = 36, filters?: StoryFilters) => {
    loading.value = true

    const params: Record<string, any> = { limit, ...buildStoryFilterParams(filters) }
    if (cursor) {
      params.cursor = cursor
    }

    const request: AxiosRequestType = {
      url: '/stories',
      method: 'GET',
      params,
    }

    try {
      const response = await singleApiRequest(request)
      const fetchedStories = response.data.stories.map((story: any) => formatStoryResponse(story))
      allStoriesCount.value = response.data.allStoriesCount
      filteredStoriesCount.value = response.data.filteredStoriesCount

      return {
        stories: fetchedStories,
        pagination: response.data.pagination as PaginationMetadata,
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchCreators = async (): Promise<StoryCreator[]> => {
    const request: AxiosRequestType = {
      url: '/stories/creators',
      method: 'GET',
    }

    try {
      const response = await singleApiRequest(request)
      return response.data.creators
    } catch (error: any) {
      throw error
    }
  }

  const fetchStory = async (ulid: string): Promise<void> => {
    const request: AxiosRequestType = {
      url: `/stories/${ulid}`,
      method: 'GET',
    }

    try {
      const response = await singleApiRequest(request)
      currentStory.value = formatStoryResponse(response.data.story)
    } catch (error) {
      throw error
    }
  }

  const createStory = async (params: StoryCreateParams): Promise<Story> => {
    const storyData: any = {
      title: params.title,
      content: params.content,
      content_type: params.contentType,
      sentiment: params.sentiment,
      program_ulids: params.programUlids,
    }

    if (params.storyDate) {
      storyData.story_date = dayjs(params.storyDate).format('YYYY-MM-DD')
    }
    if (params.notes) {
      storyData.notes = params.notes
    }
    if (params.storyTaggings?.length) {
      storyData.story_taggings = params.storyTaggings.map((t) => ({
        tag_name: t.tagName,
        tag_group_ulid: t.tagGroupUlid,
      }))
    }
    if (params.links?.length) {
      storyData.links = params.links
    }
    if (params.signedBlobIds?.length) {
      storyData.signed_blob_ids = params.signedBlobIds
    }

    const request: AxiosRequestType = {
      url: '/stories',
      method: 'POST',
      data: { story: storyData },
    }

    try {
      const response = await singleApiRequest(request)
      const newStory = formatStoryResponse(response.data.story)
      stories.value.unshift(newStory)
      return newStory
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to save story'
      throw error
    }
  }

  const updateStory = async (params: StoryUpdateParams): Promise<void> => {
    const { ulid, ...updateParams } = params
    const storyData: any = {}

    if (updateParams.title !== undefined) storyData.title = updateParams.title
    if (updateParams.content !== undefined) storyData.content = updateParams.content
    if (updateParams.contentType !== undefined) storyData.content_type = updateParams.contentType
    if (updateParams.notes !== undefined) storyData.notes = updateParams.notes
    if (updateParams.sentiment !== undefined) storyData.sentiment = updateParams.sentiment
    if (updateParams.programUlids !== undefined) storyData.program_ulids = updateParams.programUlids
    if (updateParams.storyDate) {
      storyData.story_date = dayjs(updateParams.storyDate).format('YYYY-MM-DD')
    }

    const request: AxiosRequestType = {
      url: `/stories/${ulid}`,
      method: 'PUT',
      data: { story: storyData },
    }

    try {
      const response = await singleApiRequest(request)
      currentStory.value = formatStoryResponse(response.data.story)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update story'
      throw error
    }
  }

  const fetchStoryIds = async (filters?: StoryFilters): Promise<string[]> => {
    const request: AxiosRequestType = {
      url: '/stories/ids',
      method: 'GET',
      params: buildStoryFilterParams(filters),
    }

    try {
      const response = await singleApiRequest(request)
      return response.data.ulids as string[]
    } catch (error: any) {
      return []
    }
  }

  const deleteStories = async (ulids: string[]): Promise<void> => {
    const request: AxiosRequestType = {
      url: `/stories/bulk_destroy`,
      method: 'DELETE',
      data: { ulids },
    }

    try {
      await singleApiRequest(request)
      stories.value = stories.value.filter((story) => !ulids.includes(story.ulid))
      const count = ulids.length
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete story'
      throw error
    }
  }

  const bulkUpdateStories = async (params: BulkStoryUpdateParams): Promise<void> => {
    const data: Record<string, any> = { ulids: params.ulids }
    if (params.contentType) data.content_type = params.contentType
    if (params.storyDate) data.story_date = dayjs(params.storyDate).format('YYYY-MM-DD')
    if (params.sentiment) data.sentiment = params.sentiment
    if (params.addProgramUlids?.length) data.add_program_ulids = params.addProgramUlids
    if (params.removeProgramUlids?.length) data.remove_program_ulids = params.removeProgramUlids

    const request: AxiosRequestType = {
      url: '/stories/bulk_update',
      method: 'PATCH',
      data,
    }

    try {
      await singleApiRequest(request)
      const count = params.ulids.length
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update stories'
      throw error
    }
  }

  const fetchBulkPrograms = async (ulids: string[]): Promise<{ ulid: string; name: string }[]> => {
    const request: AxiosRequestType = {
      url: '/stories/bulk_programs',
      method: 'POST',
      data: { ulids },
    }

    try {
      const response = await singleApiRequest(request)
      return response.data.programs
    } catch (error: any) {
      throw error
    }
  }

  const bulkUploadStories = async (blobSignedId: string): Promise<void> => {
    const request: AxiosRequestType = {
      url: '/stories/bulk_create',
      method: 'POST',
      data: { blob_signed_id: blobSignedId },
    }

    try {
      await singleApiRequest(request)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to upload stories'
      throw new Error(errorMessage)
    }
  }

  const addTagToStory = async (ulid: string, tagName: string, tagGroupUlid?: string): Promise<Story> => {
    const data: { tag_name: string; tag_group_ulid?: string } = { tag_name: tagName }
    if (tagGroupUlid) {
      data.tag_group_ulid = tagGroupUlid
    }

    const request: AxiosRequestType = {
      url: `/stories/${ulid}/tags`,
      method: 'POST',
      data,
    }

    try {
      const response = await singleApiRequest(request)
      const updatedStory = formatStoryResponse(response.data.story)
      return updatedStory
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to add tag to story'
      throw error
    }
  }

  const removeTagFromStory = async (ulid: string, tagUlid: string): Promise<void> => {
    const request: AxiosRequestType = {
      url: `/stories/${ulid}/tags/${tagUlid}`,
      method: 'DELETE',
    }

    try {
      await singleApiRequest(request)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to remove tag from story'
      throw error
    }
  }

  const removeTagGroupTaggings = async (storyUlid: string, tagGroupUlid: string | null): Promise<void> => {
    const request: AxiosRequestType = {
      url: `/stories/${storyUlid}/tag_group_taggings`,
      method: 'DELETE',
      params: tagGroupUlid !== null ? { tag_group_ulid: tagGroupUlid } : undefined,
    }

    try {
      await singleApiRequest(request)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to remove tag group'
      throw error
    }
  }

  const updateTagGroupTaggings = async (
    storyUlid: string,
    tagGroupUlid: string | null,
    tagUlids: string[]
  ): Promise<Story> => {
    const data: { tag_ulids: string[]; tag_group_ulid?: string } = { tag_ulids: tagUlids }
    if (tagGroupUlid !== null) {
      data.tag_group_ulid = tagGroupUlid
    }

    const request: AxiosRequestType = {
      url: `/stories/${storyUlid}/tag_group_taggings`,
      method: 'PUT',
      data,
    }

    try {
      const response = await singleApiRequest(request)
      return formatStoryResponse(response.data.story)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update tag group'
      throw error
    }
  }

  const fetchBulkTaggings = async (ulids: string[]): Promise<TagGroup[]> => {
    const request: AxiosRequestType = {
      url: '/stories/bulk_taggings',
      method: 'POST',
      data: { ulids },
    }

    try {
      const response = await singleApiRequest(request)
      return response.data.tagGroups
    } catch (error: any) {
      throw error
    }
  }

  const bulkUpdateTaggings = async (params: BulkUpdateTaggingsParams): Promise<void> => {
    const data: Record<string, any> = { ulids: params.ulids }
    if (params.addTaggings?.length) data.add_taggings = params.addTaggings
    if (params.removeTaggings?.length) data.remove_taggings = params.removeTaggings

    const request: AxiosRequestType = {
      url: '/stories/bulk_update_taggings',
      method: 'POST',
      data,
    }

    try {
      await singleApiRequest(request)
      const count = params.ulids.length
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update story tags'
      throw error
    }
  }

  return {
    stories,
    currentStory,
    allStoriesCount,
    filteredStoriesCount,
    loading,
    fetchStories,
    fetchStoryIds,
    fetchStory,
    fetchCreators,
    createStory,
    deleteStories,
    bulkUpdateStories,
    bulkUpdateTaggings,
    fetchBulkPrograms,
    fetchBulkTaggings,
    bulkUploadStories,
    updateStory,
    addTagToStory,
    removeTagFromStory,
    removeTagGroupTaggings,
    updateTagGroupTaggings,
  }
}
