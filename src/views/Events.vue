<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import Button from 'primevue/button'
  import IconField from 'primevue/iconfield'
  import IconSearch from '@primeicons/vue/search'
  import InputText from 'primevue/inputtext'
  import { onMounted } from 'vue'
  import EventsFilterBar from '@/components/EventsFilterBar.vue'
  import EventsFilterBarParams from '@/components/EventsFilterBarParams.vue'
  import EventsList from '@/components/EventsList.vue'
  import EventsSortSelect from '@/components/EventsSortSelect.vue'
  // import EventForm from '@/components/EventForm.vue'
  // import EventCardExpanded from '@/components/events/eventCardExpanded/EventCardExpanded.vue'
  // import { useDynamicDialog } from '@/composables/useDynamicDialog'
  import LayoutBackground from '@/layouts/LayoutBackground.vue'
  import LayoutEvents from '@/layouts/LayoutEvents.vue'
  import { useNavSideBarStore } from '@/stores/navSideBar'
  import { useEventsStore } from '@/stores/events'
  import { useEventsFilterStore } from '@/stores/eventsFilter'

  const eventsStore = useEventsStore()
  const {
    showEventForm,
    showZeroState,
    showEvents,
    showNoSearchResults,
    // showEventCardExpanded,
    // selectedEventIds,
    events,
    allEventsCount,
  } = storeToRefs(eventsStore)

  const filterStore = useEventsFilterStore()
  const { hasActiveFilters, hasClearableFilters, searchQuery, selectedSort } = storeToRefs(filterStore)
  // const { openDialog, closeDialog } = useDynamicDialog()

  const handleAddEvent = () => {
    showEventForm.value = true
  }

  onMounted(() => {
    useNavSideBarStore().isCollapsed = true
  })
</script>

<template>
  <LayoutBackground>
    <LayoutEvents>
      <template #actions-top-left>
        <h1 class="typography-lg font-bold text-black dark:text-white">All events</h1>
        <p v-if="events" class="typography-base text-gray-500">({{ allEventsCount }})</p>
      </template>
      <template #actions-top-right>
        <!-- <EventForm v-model="showEventForm" /> -->
        <Button label="Add event" size="small" @click="handleAddEvent" />
      </template>

      <template #clear-filters>
        <p class="typography-sm text-gray-600">Filters & Search</p>
        <Button
          :disabled="!hasClearableFilters"
          label="Clear all"
          text
          size="small"
          @click="filterStore.clearFilters" />
      </template>

      <template #search-sort>
        <IconField class="min-w-0 flex-1">
          <IconSearch class="p-inputicon" />
          <InputText
            v-model="searchQuery"
            class="w-full"
            maxlength="255"
            placeholder="Search events"
            size="medium"
            type="search"
            aria-label="Search events by title and content" />
        </IconField>
        <EventsSortSelect :model-value="selectedSort" @update:model-value="filterStore.setSort" />
      </template>

      <template #filters>
        <EventsFilterBar />
      </template>

      <template v-if="hasActiveFilters" #filter-params>
        <EventsFilterBarParams />
      </template>

      <template v-if="showZeroState" #zero-state>
        <p class="typography-base text-gray-500">No events.</p>
        <p class="typography-base text-gray-500">Create your first event and get started!</p>
      </template>

      <template v-if="showEvents" #events>
        <EventsList />
      </template>

      <template v-if="showNoSearchResults" #no-search-results>
        <p class="typography-lg py-4 font-bold text-blue-500">No events found</p>
        <p class="typography-base text-gray-500">We couldn't find any events matching your search criteria.</p>
        <p class="typography-base text-gray-500">Try adjusting filters or search terms.</p>
      </template>
    </LayoutEvents>
    <!-- <EventCardExpanded v-model="showEventCardExpanded" /> -->
  </LayoutBackground>
</template>
