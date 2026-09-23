<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import IconSpinner from '@primeicons/vue/spinner'
  import EventCard from '@/components/EventCard.vue'
  import { useEventsStore } from '@/stores/events'

  const { events, filteredEventsCount, loading } = storeToRefs(useEventsStore())

  const filteredEventsCountText = computed(() =>
    filteredEventsCount.value === 1 ? '1 event' : `${filteredEventsCount.value} events`
  )
</script>

<template>
  <p class="typography-sm pb-4 leading-[1.5rem] text-gray-600">{{ filteredEventsCountText }}</p>
  <div v-if="loading" class="w-full h-full flex justify-center items-center">
    <IconSpinner size="32" />
  </div>
  <div v-else class="grid grid-cols-2 content-start gap-4 xl:grid-cols-3 2xl:grid-cols-4">
    <EventCard v-for="event in events" :key="event.ulid" :event="event" />
  </div>
</template>
