<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import Badge from 'primevue/badge'
  import Button from 'primevue/button'
  import Checkbox from 'primevue/checkbox'
  import CheckboxGroup from 'primevue/checkboxgroup'
  import DatePicker, { type DatePickerPassThroughOptions } from 'primevue/datepicker'
  import InputText from 'primevue/inputtext'
  import { type PanelPassThroughOptions } from 'primevue/panel'
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import StoriesFilterBarPanel from '@/components/StoriesFilterBarPanel.vue'
  import StoriesFilterBarPanelTagGroup from '@/components/StoriesFilterBarPanelTagGroup.vue'
  import { RouteNames } from '@/router/types'
  import { useProgramsStore } from '@/stores/programs'
  import { useStoriesFilterStore } from '@/stores/storiesFilter'
  import { useTagGroupsStore } from '@/stores/tagGroups'
  import { SENTIMENTS } from '@/components/types'
  import { formatDateRange } from '@/utils/formatDate'

  const router = useRouter()
  const filterStore = useStoriesFilterStore()
  const programsStore = useProgramsStore()
  const tagGroupsStore = useTagGroupsStore()

  const { selectedPrograms, selectedSentiments, storyDateRange, selectedCreators, createdDateRange, filterTagGroups } =
    storeToRefs(filterStore)
  const { tagGroups, ungroupedTags } = storeToRefs(tagGroupsStore)

  onMounted(() => {
    filterStore.loadCreators()
  })

  const dateRangeText = computed(() => {
    const dates = storyDateRange.value
    return formatDateRange(dates?.[0], dates?.[1])
  })

  const createdDateRangeText = computed(() => {
    const dates = createdDateRange.value
    return formatDateRange(dates?.[0], dates?.[1])
  })

  const filterTagGroupsWithTags = computed(() => {
    return filterTagGroups.value.filter((group) => (group.tags?.length ?? 0) > 0)
  })

  const hasLoadedTagFilters = computed(() => tagGroups.value !== undefined && ungroupedTags.value !== undefined)

  const showNoTagsMessage = computed(() => {
    return hasLoadedTagFilters.value && filterTagGroupsWithTags.value.length === 0
  })

  const navToManageTags = () => console.log('navigate to nowhere') // router.push({ name: RouteNames.collectStories2ManageTags })

  const clearDateRangeText = () => {
    if (storyDateRange.value) {
      storyDateRange.value = undefined
    }
  }

  const clearCreatedDateRangeText = () => {
    if (createdDateRange.value) {
      createdDateRange.value = undefined
    }
  }

  const panelProps: PanelPassThroughOptions = {
    root: '!border-white !rounded-lg',
    header: '!pt-1 !pr-1 !pb-0',
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
  <div class="flex flex-col items-start gap-1 pb-6">
    <p class="typography-sm pb-3 pt-6 font-normal text-gray-700">PROPERTIES</p>
    <!-- programs -->
    <StoriesFilterBarPanel :pt="panelProps">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Program</p>
          <Badge
            v-if="selectedPrograms.length > 0"
            :value="selectedPrograms.length"
            class="!rounded-full"
            size="small"></Badge>
        </div>
      </template>
      <CheckboxGroup v-model="selectedPrograms" class="flex flex-col gap-4 pt-2">
        <div v-for="program in filterStore.selectOptionPrograms" :key="program.ulid" class="flex items-center gap-2">
          <Checkbox :input-id="program.ulid" name="programs" :value="program.ulid" size="small" />
          <label :for="program.ulid" class="typography-sm leading-[1rem] text-gray-700">{{ program.label }}</label>
        </div>
      </CheckboxGroup>
    </StoriesFilterBarPanel>
    <!-- sentiments -->
    <StoriesFilterBarPanel :pt="panelProps">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Sentiment</p>
          <Badge
            v-if="selectedSentiments.length > 0"
            :value="selectedSentiments.length"
            class="!rounded-full"
            size="small"></Badge>
        </div>
      </template>
      <CheckboxGroup v-model="selectedSentiments" class="flex flex-col gap-4 pt-2">
        <div v-for="sentiment in SENTIMENTS" :key="sentiment.value" class="flex items-center gap-2">
          <Checkbox :input-id="sentiment.value" name="sentiments" :value="sentiment.value" size="small" />
          <label :for="sentiment.value" class="typography-sm leading-[1rem] text-gray-700">{{ sentiment.label }}</label>
        </div>
      </CheckboxGroup>
    </StoriesFilterBarPanel>
    <!-- Date range -->
    <StoriesFilterBarPanel :pt="{ ...panelProps, content: '!p-1' }" class="date-picker">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Date range</p>
          <Badge v-if="!!storyDateRange" size="small" value="1"></Badge>
        </div>
      </template>
      <div class="flex flex-col">
        <InputText
          id="date-range-text"
          :value="dateRangeText"
          class="cursor-pointer"
          placeholder="Pick a date range"
          readonly
          type="text"
          @click="clearDateRangeText" />
        <Button
          class="!absolute right-[0.375rem] top-[0.375rem] h-0 !text-gray-400 hover:!bg-transparent"
          icon="pi pi-trash"
          text
          rounded
          aria-label="Clear date range"
          size="small"
          @click="clearDateRangeText" />
        <DatePicker
          v-model="storyDateRange"
          :pt="datePickerProps"
          aria-label="Story date range"
          inline
          selection-mode="range" />
      </div>
    </StoriesFilterBarPanel>
    <!-- Added by -->
    <StoriesFilterBarPanel :pt="panelProps">
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
          <Checkbox :input-id="creator.id.toString()" name="creators" :value="creator.id" size="small" />
          <label :for="creator.id.toString()" class="typography-sm leading-[1rem] text-gray-700">{{
            creator.fullName
          }}</label>
        </div>
      </CheckboxGroup>
    </StoriesFilterBarPanel>
    <!-- Added date range -->
    <StoriesFilterBarPanel :pt="{ ...panelProps, content: '!p-1' }" class="date-picker">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <p class="typography-sm font-semibold leading-[1.5rem] text-gray-700">Added date range</p>
          <Badge v-if="!!createdDateRange" size="small" value="1"></Badge>
        </div>
      </template>
      <div class="flex flex-col">
        <InputText
          id="created-date-range-text"
          :value="createdDateRangeText"
          class="cursor-pointer"
          placeholder="Pick a date range"
          readonly
          type="text"
          @click="clearCreatedDateRangeText" />
        <Button
          class="!absolute right-[0.375rem] top-[0.375rem] h-0 !text-gray-400 hover:!bg-transparent"
          icon="pi pi-trash"
          text
          rounded
          aria-label="Clear date range"
          size="small"
          @click="clearCreatedDateRangeText" />
        <DatePicker
          v-model="createdDateRange"
          :pt="datePickerProps"
          aria-label="Added date range"
          inline
          selection-mode="range" />
      </div>
    </StoriesFilterBarPanel>
    <!-- tags -->
    <div class="flex w-full items-center justify-between pb-3 pt-6">
      <p class="typography-sm font-normal text-gray-700">TAGS</p>
      <Button label="Manage tags" text size="small" @click="navToManageTags" />
    </div>
    <p v-if="showNoTagsMessage" class="typography-sm pl-3 leading-[1.5rem] text-gray-700">
      No tags yet. Manage tags to create some.
    </p>
    <StoriesFilterBarPanelTagGroup
      v-for="group in filterTagGroupsWithTags"
      :key="group.ulid"
      :group="group"
      :pt="panelProps" />
  </div>
</template>

<style scoped>
  @reference "../assets/main.css";
  .date-picker :deep(.p-inputtext) {
    font-size: 0.875rem !important;
  }
</style>
