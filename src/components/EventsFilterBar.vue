<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import Badge from 'primevue/badge'
  import Button from 'primevue/button'
  import Checkbox from 'primevue/checkbox'
  import CheckboxGroup from 'primevue/checkboxgroup'
  import DatePicker, { type DatePickerPassThroughOptions } from 'primevue/datepicker'
  import InputText from 'primevue/inputtext'
  import { type PanelPassThroughOptions } from 'primevue/panel'
  import { computed } from 'vue'
  import Trash from '@primeicons/vue/trash'
  import EventsFilterBarPanel from '@/components/EventsFilterBarPanel.vue'
  import { useEventsFilterStore } from '@/stores/eventsFilter'
  import { RATINGS } from '@/components/types'
  import { formatDateRange } from '@/utils/formatDate'

  const filterStore = useEventsFilterStore()

  const { selectedEventTypes, selectedRatings, eventDateRange, selectedCreators } =
    storeToRefs(filterStore)

  const dateRangeText = computed(() => {
    const dates = eventDateRange.value
    return formatDateRange(dates?.[0], dates?.[1])
  })

  const clearDateRangeText = () => {
    if (eventDateRange.value) {
      eventDateRange.value = undefined
    }
  }

  const panelProps: PanelPassThroughOptions = {
    root: '!border-white dark:!border-gray-800 !rounded-lg w-full',
    header: '!pt-[0.25rem] !pr-[0.25rem] !pb-0',
  }

  const datePickerProps: DatePickerPassThroughOptions = {
    panel: 'max-w-[240px] !px-1',
    calendarContainer: 'w-full',
    weekDayCell: '!p-0',
    weekDay: '!text-xs flex justify-center',
    dayCell: '!p-0',
    day: '!w-8 !h-8 !text-xs',
    buttonbar: '!mt-1',
  }
</script>

<template>
  <div class="flex flex-col items-start gap-1 pb-[1.5rem]">
    <p class="typography-sm pb-[0.75rem] pt-[1rem] font-normal text-gray-700">PROPERTIES</p>
    <!-- eventTypes -->
    <EventsFilterBarPanel :pt="panelProps">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Type</p>
          <Badge
            v-if="selectedEventTypes.length > 0"
            :value="selectedEventTypes.length"
            class="!rounded-full"
            size="small"></Badge>
        </div>
      </template>
      <CheckboxGroup v-model="selectedEventTypes" class="flex flex-col gap-4 pt-2">
        <div v-for="eventType in filterStore.selectOptionEventTypes" :key="eventType.ulid" class="flex items-center gap-2">
          <Checkbox :input-id="eventType.ulid" name="eventTypes" :value="eventType.ulid" size="small" />
          <label :for="eventType.ulid" class="typography-sm leading-[1rem] text-gray-700">{{ eventType.label }}</label>
        </div>
      </CheckboxGroup>
    </EventsFilterBarPanel>
    <!-- ratings -->
    <EventsFilterBarPanel :pt="panelProps">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Rating</p>
          <Badge
            v-if="selectedRatings.length > 0"
            :value="selectedRatings.length"
            class="!rounded-full"
            size="small"></Badge>
        </div>
      </template>
      <CheckboxGroup v-model="selectedRatings" class="flex flex-col gap-4 pt-2">
        <div v-for="rating in RATINGS" :key="rating.value" class="flex items-center gap-2">
          <Checkbox :input-id="rating.value" name="ratings" :value="rating.value" size="small" />
          <label :for="rating.value" class="typography-sm leading-[1rem] text-gray-700">{{ rating.label }}</label>
        </div>
      </CheckboxGroup>
    </EventsFilterBarPanel>
    <!-- Date range -->
    <EventsFilterBarPanel :pt="{ ...panelProps, content: '!p-1' }" class="date-picker">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Date range</p>
          <Badge v-if="!!eventDateRange" size="small" value="1"></Badge>
        </div>
      </template>
      <div class="flex flex-col relative">
        <InputText
          id="date-range-text"
          :value="dateRangeText"
          class="cursor-pointer"
          placeholder="Pick a date range"
          readonly
          type="text"
          @click="clearDateRangeText" />
        <Button
          class="!absolute right-[0.125rem] hover:!bg-transparent"
          icon-only
          text
          rounded
          aria-label="Clear date range"
          size="medium"
          @click="clearDateRangeText"><Trash color="grey" size="16" /></Button>
        <DatePicker
          v-model="eventDateRange"
          :pt="datePickerProps"
          aria-label="Event date range"
          inline
          selection-mode="range" />
      </div>
    </EventsFilterBarPanel>
    <!-- Added by -->
    <EventsFilterBarPanel :pt="panelProps">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Added by</p>
          <Badge
            v-if="selectedCreators.length > 0"
            :value="selectedCreators.length"
            class="!rounded-full"
            size="small"></Badge>
        </div>
      </template>
      <CheckboxGroup v-model="selectedCreators" class="flex flex-col gap-4 pt-2">
        <div v-for="creator in filterStore.creators" :key="creator.id" class="flex items-center gap-2">
          <Checkbox :input-id="creator.id" name="creators" :value="creator.id" size="small" />
          <label :for="creator.id" class="typography-sm leading-[1rem] text-gray-700">{{
            creator.fullName
          }}</label>
        </div>
      </CheckboxGroup>
    </EventsFilterBarPanel>
  </div>
</template>

<style scoped>
  .date-picker :deep(.p-inputtext) {
    font-size: 0.875rem !important;
  }
</style>
