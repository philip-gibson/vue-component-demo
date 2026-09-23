import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type EventType } from '@/components/types'
import { eventTypesList } from '@/utils/mockData'

export const useEventTypesStore = defineStore('eventTypes', () => {
  const eventTypes = ref<EventType[]>(eventTypesList)

  const selectOptionEventTypes = computed(() => {
    return eventTypes.value?.map((eventType: EventType) => ({ label: eventType.name, ulid: eventType.ulid })) ?? []
  })


  function $reset() {
    eventTypes.value = []
  }

  return {
    selectOptionEventTypes,
    eventTypes,
    $reset,
  }
})
