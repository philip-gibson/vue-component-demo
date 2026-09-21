<script lang="ts" setup>
  import dayjs from 'dayjs'
  import IconTimes from '@primeicons/vue/times';
  import IconCalendar from '@primeicons/vue/calendar';
  import IconAsterisk from '@primeicons/vue/asterisk'
  import InputErrorMessage from '@/components/InputErrorMessage.vue'
  import VueDatePicker, { type DatePickerInstance } from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import { formatDate } from '@/utils/formatDate'
  import { nextTick, ref } from 'vue'
  import { useField } from 'vee-validate'
  import { watchImmediate } from '@vueuse/core'

  const props = defineProps<{ name: string; fixedStartDate?: boolean; disabled?: boolean }>()
  const dateRange = defineModel<[Date, Date]>()
  const datePicker = ref()
  const inputStartDate = ref()
  const inputEndDate = ref()

  const { errorMessage, handleChange, setValue, value: field } = useField(() => props.name)

  watchImmediate(
    () => field.value,
    () => (dateRange.value = field.value as [Date, Date])
  )

  const format = (dates: Date[]) => {
    return formatDate(dates[0], 'MMM D, YYYY') + ' - ' + formatDate(dates[1], 'MMM D, YYYY')
  }

  const calendarPosition = () => ({ top: '1.25rem', left: '-0.625rem' })

  const beforeToday = (date: Date) =>
    props.fixedStartDate ? dayjs(date).isBefore((field.value as [Date, Date])[0], 'day') : false

  const handleBlur = () => {
    if (inputStartDate.value.value && inputEndDate.value.value) {
      dateRange.value = [inputStartDate.value.value, inputEndDate.value.value]
      setValue([new Date(dateRange.value![0]), new Date(dateRange.value![1])])
    }
  }

  const handleCleared = () => {
    inputStartDate.value.value = null
    inputEndDate.value.value = null
    dateRange.value = undefined
    inputStartDate.value.focus()
  }

  const handleDelete = () => {
    if (!props.fixedStartDate) {
      inputStartDate.value.value = null
      inputEndDate.value.value = null
      dateRange.value = undefined
      inputStartDate.value.focus()
    }
  }

  const handleOpen = async () => {
    await nextTick()
    if (props.fixedStartDate) {
      inputEndDate.value.value = null
      inputEndDate.value.focus()
    } else inputStartDate.value.focus()
  }

  const handleRangeStart = (date: Date) => (inputStartDate.value.value = formatDate(date, 'MMM D, YYYY'))
  const handleRangeEnd = (date: Date) => (inputEndDate.value.value = formatDate(date, 'MMM D, YYYY'))

  const handleTab = () => {
    datePicker.value.closeMenu()
    handleBlur()
  }
</script>

<template>
  <label
    :for="name"
    class="flex flex-col items-start gap-y-[0.25rem] text-[0.875rem] font-medium leading-[1.25rem] dark:text-white pb-[0.5rem]">
    <span class="flex text-[0.875rem] font-medium leading-[1.25rem] dark:text-white">
      <slot name="label" />
      <span v-if="!disabled" class="flex"> &nbsp;<IconAsterisk /> </span>
    </span>
    <VueDatePicker
      :ref="(el: DatePickerInstance) => (datePicker = el)"
      v-model="dateRange"
      :alt-position="calendarPosition"
      :clearable="!fixedStartDate"
      :disabled="disabled"
      :disabled-dates="beforeToday"
      :enable-time-picker="false"
      :format="format"
      :month-change-on-scroll="false"
      :range="{ fixedStart: fixedStartDate }"
      :week-start="0"
      auto-apply
      multi-calendars
      text-input
      utc="preserve"
      @blur="handleBlur"
      @cleared="handleCleared"
      @open="handleOpen"
      @keydown.delete="handleDelete"
      @keydown.tab="handleTab"
      @range-start="handleRangeStart"
      @range-end="handleRangeEnd"
      @update:model-value="handleChange">
      <template #dp-input="{ value, onBlur, onKeypress }">
        <div
          :class="[
            {
              'border-red-300 hover:border-red-500 focus-within:border-red-500 focus-within:shadow-none focus-within:ring-red-500':
                errorMessage,
              'cursor-not-allowed border-gray-300 bg-gray-50': disabled,
            },
          ]"
          class="flex items-center w-full rounded-[0.1875rem] border border-solid border-gray-300 px-[2.5rem] py-[0.375rem] text-[1rem]
            font-[400] leading-[1.75rem] text-black hover:border-gray-500 focus-within:border-blue-500 focus-within:outline-0
            focus-within:ring-1 focus-within:ring-inset focus-within:ring-blue-500 dark:bg-gray-700
            dark:text-white dark:placeholder:text-gray-300"
          @focusout="onBlur">
          <input
            :id="`${name}-start-date`"
            ref="inputStartDate"
            :disabled="fixedStartDate || disabled"
            :value="value.split(' - ')[0]"
            class="grow bg-transparent border-none p-[0rem] leading-[1.75rem] focus:outline-0 focus:ring-0 focus:shadow-none
              disabled:text-gray-400 disabled:pointer-events-none"
            placeholder="Start date"
            tabindex="0"
            type="text"
            @keypress.delete="onKeypress" />
          <p class="typography-sm text-gray-400 px-[0.75rem]">to</p>
          <input
            :id="`${name}-end-date`"
            ref="inputEndDate"
            :disabled="disabled"
            :value="value.split(' - ')[1]"
            class="grow bg-transparent border-none p-[0rem] leading-[1.75rem] focus:outline-0 focus:ring-0 focus:shadow-none
              disabled:text-gray-400 disabled:pointer-events-none"
            placeholder="End date"
            tabindex="0"
            type="text"
            @keypress.delete="onKeypress" />
          <IconCalendar :rems="1" bold class="absolute fill-gray-400 left-[0.75rem] top-[0.75rem]" />
        </div>
      </template>
      <template #clear-icon="{ clear }">
        <IconTimes class="fill-gray-400 max-h-[1rem] max-w-[1rem] right-[0.75rem]" @click="clear" />
      </template>
    </VueDatePicker>
    <InputErrorMessage :error-message="errorMessage" />
  </label>
</template>

<style scoped>
  @reference "../assets/main.css";
  .dp__today.dp__range_start {
    @apply bg-blue-500;
  }
  .dp--future.dp__range_between {
    @apply border-white bg-blue-50 text-blue-100;
  }
  .dp--future.dp__range_end {
    @apply border-blue-500 border-dashed border-[2px] bg-blue-50 text-blue-100;
  }
  .dp--future.dp__range_end:hover {
    @apply border-blue-500 border-dashed border-[2px] bg-blue-500 text-white;
  }
  .dp__cell_inner.dp__date_hover {
    @apply bg-blue-500 text-white;
  }
  .dp__cell_inner.dp__cell_offset.dp__date_hover {
    @apply bg-white;
  }
  .dp__cell_inner.dp__cell_offset {
    @apply text-gray-300;
  }
</style>
