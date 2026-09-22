<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import Button from 'primevue/button'
  import IconField from 'primevue/iconfield'
  import InputIcon from 'primevue/inputicon'
  import InputText from 'primevue/inputtext'
  import { onMounted, ref } from 'vue'
  // import BulkActionToolbar from '@/components/stories/BulkActionToolbar.vue'
  // import BulkEditPropertiesDrawer from '@/components/stories/BulkEditPropertiesDrawer.vue'
  // import BulkEditTagsDrawer from '@/components/stories/BulkEditTagsDrawer.vue'
  // import BulkUploadStories from '@/components/stories/BulkUploadStories.vue'
  import StoriesFilterBar from '@/components/StoriesFilterBar.vue'
  import StoriesFilterBarParams from '@/components/StoriesFilterBarParams.vue'
  import StoriesList from '@/components/StoriesList.vue'
  import StoriesSortSelect from '@/components/StoriesSortSelect.vue'
  // import StoryForm from '@/components/StoryForm.vue'
  // import StoryCardExpanded from '@/components/stories/storyCardExpanded/StoryCardExpanded.vue'
  import { useDynamicDialog } from '@/composables/useDynamicDialog'
  import LayoutBackground from '@/layouts/LayoutBackground.vue'
  import LayoutStories from '@/layouts/LayoutStories.vue'
  import { useNavSideBarStore } from '@/stores/navSideBar'
  import { useStoriesStore } from '@/stores/stories'
  import { useStoriesFilterStore } from '@/stores/storiesFilter'

  const storiesStore = useStoriesStore()
  const {
    showStoryForm,
    showBulkUpload,
    showZeroState,
    showStories,
    showNoSearchResults,
    showStoryCardExpanded,
    showBulkEditTagsDrawer,
    selectedStoryIds,
    stories,
    allStoriesCount,
  } = storeToRefs(storiesStore)

  const showBulkEditProperties = ref(false)

  const filterStore = useStoriesFilterStore()
  const { hasActiveFilters, hasClearableFilters, searchQuery, selectedSort } = storeToRefs(filterStore)
  const { openDialog, closeDialog } = useDynamicDialog()

  const handleAddStory = () => {
    showStoryForm.value = true
  }

  const handleBulkUploadStories = () => {
    showBulkUpload.value = true
  }

  const handleBulkDelete = () => {
    openDialog({
      data: {
        header: 'Delete stories?',
        message: 'Are you sure you want to delete the selected stories? This action cannot be undone.',
        confirmLabel: 'Delete stories',
        severity: 'danger',
        isDelete: true,
      },
      onConfirm: async () => {
        try {
          const ulidsToDelete = [...selectedStoryIds.value]
          await storiesStore.removeStories(ulidsToDelete)
          storiesStore.exitBulkMode()
        } catch (error) {
          console.error('Error deleting stories:', error)
        } finally {
          closeDialog()
        }
      },
    })
  }

  const handleBulkEditProperties = () => {
    showBulkEditProperties.value = true
  }

  onMounted(() => {
    storiesStore.loadStories()
    useNavSideBarStore().isCollapsed = true
  })
</script>

<template>
  <LayoutBackground>
    <LayoutStories>
      <template #actions-top-left>
        <h1 class="typography-lg font-bold text-black">All stories</h1>
        <p v-if="stories" class="typography-base text-gray-500">({{ allStoriesCount }})</p>
      </template>
      <template #actions-top-right>
        <!-- <StoryForm v-model="showStoryForm" />
        <BulkUploadStories v-model="showBulkUpload" /> -->
        <Button label="Add story" severity="secondary" size="small" @click="handleAddStory" />
        <Button label="Bulk upload stories" size="small" @click="handleBulkUploadStories" />
      </template>

      <template #clear-filters>
        <p class="typography-sm text-gray-600">Filters</p>
        <Button
          :disabled="!hasClearableFilters"
          label="Clear all"
          link
          size="small"
          @click="filterStore.clearFilters" />
      </template>

      <template #search-sort>
        <IconField class="min-w-0 flex-1">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            class="w-full"
            maxlength="255"
            placeholder="Search stories"
            size="small"
            type="search"
            aria-label="Search stories by title and content" />
        </IconField>
        <StoriesSortSelect :model-value="selectedSort" @update:model-value="filterStore.setSort" />
      </template>

      <template #filters>
        <StoriesFilterBar />
      </template>

      <template v-if="hasActiveFilters" #filter-params>
        <StoriesFilterBarParams />
      </template>

      <template v-if="showZeroState" #zero-state>
        <p class="typography-base text-gray-500">No stories.</p>
        <p class="typography-base text-gray-500">Create your first story and get started!</p>
      </template>

      <template v-if="showStories" #stories>
        <StoriesList />
      </template>

      <template v-if="showNoSearchResults" #no-search-results>
        <p class="typography-lg py-4 font-bold text-blue-500">No stories found</p>
        <p class="typography-base text-gray-500">We couldn't find any stories matching your search criteria.</p>
        <p class="typography-base text-gray-500">Try adjusting filters or search terms.</p>
      </template>
    </LayoutStories>
    <!-- <StoryCardExpanded v-model="showStoryCardExpanded" /> -->
    <!-- <BulkActionToolbar @delete="handleBulkDelete" @edit-properties="handleBulkEditProperties" />
    <BulkEditPropertiesDrawer v-model:visible="showBulkEditProperties" :selected-count="selectedStoryIds.length" />
    <BulkEditTagsDrawer v-model:visible="showBulkEditTagsDrawer" /> -->
  </LayoutBackground>
</template>
