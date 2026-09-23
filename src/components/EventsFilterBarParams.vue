<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import Chip from 'primevue/chip'
  import { computed } from 'vue'
  import Times from '@primeicons/vue/times'
  import { useEventsFilterStore } from '@/stores/eventsFilter'
  import { RATINGS } from '@/components/types'
  import { formatDateRange } from '@/utils/formatDate'

  const filterStore = useEventsFilterStore()
  const {
    selectedEventTypes,
    selectedRatings,
    eventDateRange,
    selectedCreators,
    createdDateRange,
    searchQuery,
  } = storeToRefs(filterStore)
  const SEARCH_CHIP_MAX_LENGTH = 20

  const getEventTypeLabel = (eventTypeUlid: string) => {
    const eventType = filterStore.selectOptionEventTypes.find((p) => p.ulid === eventTypeUlid)
    return eventType ? eventType.label : 'Unknown EventType'
  }

  const removeEventType = (eventTypeUlid: string) => {
    selectedEventTypes.value = selectedEventTypes.value.filter((id) => id !== eventTypeUlid)
  }

  const getRatingLabel = (ratingValue: string) => {
    const rating = RATINGS.find((r) => r.value === ratingValue)
    return rating ? rating.label : 'Unknown Rating'
  }

  const removeRating = (rating: string) => {
    selectedRatings.value = selectedRatings.value.filter((r) => r !== rating)
  }

  const removeEventDateRange = () => {
    eventDateRange.value = undefined
  }

  const getCreatorLabel = (creatorId: string) => {
    const creator = filterStore.creators.find((c) => c.id === creatorId)
    return creator ? creator.fullName : 'Unknown Creator'
  }

  const removeCreator = (creatorId: string) => {
    selectedCreators.value = selectedCreators.value.filter((id) => id !== creatorId)
  }

  const removeCreatedDateRange = () => {
    createdDateRange.value = undefined
  }

  const removeSearch = () => {
    searchQuery.value = ''
  }

  const searchChipText = computed(() => {
    const normalizedSearch = searchQuery.value.trim()
    if (normalizedSearch.length < 2) return ''

    const truncated =
      normalizedSearch.length > SEARCH_CHIP_MAX_LENGTH
        ? `${normalizedSearch.slice(0, SEARCH_CHIP_MAX_LENGTH)}...`
        : normalizedSearch

    return `Search: ${truncated}`
  })

  const dateRangeChipText = computed(() => {
    const dates = eventDateRange.value ?? []
    const text = formatDateRange(dates[0], dates[1])
    return text ? `Date: ${text}` : ''
  })
  const createdDateRangeChipText = computed(() => {
    const dates = createdDateRange.value ?? []
    const text = formatDateRange(dates[0], dates[1])
    return text ? `Added date: ${text}` : ''
  })

  const chipProps = {
    root: '!bg-blue-50 !rounded-xl !px-[0.5rem] !py-[0.25rem] dark:!bg-emerald-700',
    label: '!text-[12.5px] !font-semibold !text-blue-700 leading-[0.875rem] dark:!text-emerald-200',
  }
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Chip
      v-if="searchChipText"
      :label="searchChipText"
      :pt="chipProps"
      removable>
      <template #removeicon>
        <Times color="grey" @click="removeSearch" class="cursor-pointer" />
      </template>
    </Chip>
    <Chip
      v-for="eventType in selectedEventTypes"
      :key="eventType"
      :label="getEventTypeLabel(eventType)"
      :pt="chipProps"
      removable>
      <template #removeicon>
        <Times @click="removeEventType(eventType)" class="cursor-pointer text-gray-700 dark:!text-emerald-200" />
      </template>
    </Chip>
    <Chip
      v-for="rating in selectedRatings"
      :key="rating"
      :label="getRatingLabel(rating)"
      :pt="chipProps"
      removable>
      <template #removeicon>
        <Times @click="removeRating(rating)" class="cursor-pointer text-gray-700 dark:!text-emerald-200" />
      </template>
    </Chip>
    <Chip
      v-if="eventDateRange"
      :label="dateRangeChipText"
      :pt="chipProps"
      removable>
      <template #removeicon>
        <Times @click="removeEventDateRange" class="cursor-pointer text-gray-700 dark:!text-emerald-200" />
      </template>
    </Chip>
    <Chip
      v-for="creator in selectedCreators"
      :key="creator"
      :label="getCreatorLabel(creator)"
      :pt="chipProps"
      removable>
      <template #removeicon>
        <Times @click="removeCreator(creator)" class="cursor-pointer text-gray-700 dark:!text-emerald-200" />
      </template>
    </Chip>
    <Chip
      v-if="createdDateRange"
      :label="createdDateRangeChipText"
      :pt="chipProps"
      removable>
      <template #removeicon>
        <Times @click="removeCreatedDateRange" class="cursor-pointer text-gray-700 dark:!text-emerald-200" />
      </template>
    </Chip>
  </div>
</template>
