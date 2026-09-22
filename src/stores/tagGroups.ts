import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type Tag, type TagGroup, TagGroupSortOption } from '@/components/types'

export const useTagGroupsStore = defineStore('tagGroups', () => {
  const tagGroups = ref<TagGroup[]>()
  const ungroupedTags = ref<Tag[]>()


  const deletingTagId = ref<string | null>(null)
  const updatingTagId = ref<string | null>(null)
  const editingTagId = ref<string | null>(null)
  const addingToGroupId = ref<string | null>(null)
  const searchTerm = ref('')
  const showUnusedOnly = ref(false)
  const sortOption = ref(TagGroupSortOption.CREATED_AT_DESC)

  const isSearchActive = computed(() => searchTerm.value.trim().length >= 2)

  const filteredTagGroups = computed((): TagGroup[] | undefined => {
    if (!tagGroups.value) return undefined

    const sortedGroups = sortGroups(tagGroups.value, sortOption.value)

    if (!isSearchActive.value) return sortedGroups

    const term = searchTerm.value.trim().toLowerCase()

    return sortedGroups.filter((group: TagGroup) => {
      if (group.name.toLowerCase().includes(term)) return true
      return group.tags.some((tag: Tag) => tag.name.toLowerCase().includes(term))
    })
  })

  const filteredUngroupedTags = computed((): Tag[] | undefined => {
    if (!ungroupedTags.value) return undefined
    if (!isSearchActive.value) return ungroupedTags.value
    const term = searchTerm.value.trim().toLowerCase()
    if ('ungrouped'.startsWith(term)) return ungroupedTags.value
    return ungroupedTags.value.filter((tag: Tag) => tag.name.toLowerCase().includes(term))
  })

  const showNoSearchResults = computed(() => {
    if (!isSearchActive.value) return false
    return filteredTagGroups.value?.length === 0 && filteredUngroupedTags.value?.length === 0
  })

  const showTagGroups = computed(() => {
    return !!(tagGroups.value && ungroupedTags.value) && !showNoSearchResults.value
  })

  const showZeroState = computed(() => {
    return tagGroups.value && ungroupedTags.value && allTags.value.length === 0 && tagGroups.value.length === 0
  })

  const allTagsAndGroups = computed(() => {
    const ungrouped = ungroupedTags.value?.map((tag: Tag) => ({ ...tag, groupName: 'Ungrouped' })) ?? []
    const grouped =
      tagGroups.value?.flatMap((group: TagGroup) =>
        group.tags.map((tag: Tag) => ({ ...tag, groupName: group.name, groupUlid: group.ulid }))
      ) ?? []
    return [...ungrouped, ...grouped]
  })

  const allTags = computed(() => {
    const ungrouped = ungroupedTags.value ?? []
    const seenUlids = new Set(ungrouped.map((t) => t.ulid))
    const grouped = (tagGroups.value ?? [])
      .flatMap((group) => group.tags)
      .filter((tag) => {
        if (seenUlids.has(tag.ulid)) return false
        seenUlids.add(tag.ulid)
        return true
      })
    return [...ungrouped, ...grouped]
  })

  function $reset() {
    tagGroups.value = undefined
    ungroupedTags.value = undefined
    deletingTagId.value = null
    updatingTagId.value = null
    editingTagId.value = null
    addingToGroupId.value = null
    searchTerm.value = ''
    showUnusedOnly.value = false
    sortOption.value = TagGroupSortOption.CREATED_AT_DESC
  }

  function sortGroups(tagGroups: TagGroup[], sortOption: any): TagGroup[] {
    switch (sortOption) {
      case TagGroupSortOption.CREATED_AT_DESC:
        return sortByCreatedAt(tagGroups)
      case TagGroupSortOption.CREATED_AT_ASC:
        return sortByCreatedAt(tagGroups).reverse()
      case TagGroupSortOption.NAME_ASC:
        return sortByName(tagGroups)
      case TagGroupSortOption.NAME_DESC:
        return sortByName(tagGroups).reverse()
      case TagGroupSortOption.TAG_COUNT_DESC:
        return sortByTagCount(tagGroups)
      case TagGroupSortOption.TAG_COUNT_ASC:
        return sortByTagCount(tagGroups).reverse()
      default:
        return tagGroups
    }
  }

  function sortByCreatedAt(tagGroups: TagGroup[]): TagGroup[] {
    return [...tagGroups].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
  }

  function sortByName(tagGroups: TagGroup[]): TagGroup[] {
    return [...tagGroups].sort((a, b) => a.name.localeCompare(b.name))
  }

  function sortByTagCount(tagGroups: TagGroup[]): TagGroup[] {
    return [...tagGroups].sort((a, b) => {
      const countDiff = b.tags.length - a.tags.length
      if (countDiff !== 0) return countDiff
      return b.name.localeCompare(a.name)
    })
  }

  function findTagByName(name: string): Tag | undefined {
    return allTags.value.find((tag) => tag.name.toLowerCase() === name.toLowerCase() && tag.category === 'story')
  }

  function setEditingTag(tagUlid: string | null): void {
    editingTagId.value = tagUlid
  }

  function toggleShowUnusedOnly(): void {
    showUnusedOnly.value = !showUnusedOnly.value
  }

  return {
    tagGroups,
    ungroupedTags,
    showZeroState,
    showNoSearchResults,
    showTagGroups,
    deletingTagId,
    updatingTagId,
    editingTagId,
    addingToGroupId,
    searchTerm,
    isSearchActive,
    sortOption,
    filteredTagGroups,
    filteredUngroupedTags,
    showUnusedOnly,
    allTags,
    allTagsAndGroups,
    setEditingTag,
    toggleShowUnusedOnly,
    $reset,
  }
})
