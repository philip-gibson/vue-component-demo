<script lang="ts" setup>
  import { type SelectPassThroughOptions } from 'primevue/select'
  import Select from 'primevue/select'
  import { computed } from 'vue'
  import { DEFAULT_STORY_SORT, STORY_SORT_LABEL_BY_VALUE, STORY_SORT_OPTIONS, type StorySortValue } from '@/components/types'

  const model = defineModel<StorySortValue>({ required: true })

  const groupedOptions = computed(() => {
    const groups: Array<{ label: string; items: Array<{ label: string; value: StorySortValue }> }> = []
    STORY_SORT_OPTIONS.forEach((option) => {
      let group = groups.find((item) => item.label === option.groupLabel)
      if (!group) {
        group = { label: option.groupLabel, items: [] }
        groups.push(group)
      }
      group.items.push({ label: option.label, value: option.value })
    })
    return groups
  })

  const selectedSortLabel = computed(() => STORY_SORT_LABEL_BY_VALUE[model.value || DEFAULT_STORY_SORT])

  const selectProps: SelectPassThroughOptions = {
    overlay: '!mt-1 !rounded-lg !border !border-gray-200 !shadow-sm',
    listContainer: '!max-h-none',
    list: '!py-1',
    option: '!px-0 !py-0',
    optionGroup: '!p-0',
  }
</script>

<template>
  <Select
    v-model="model"
    :options="groupedOptions"
    :pt="selectProps"
    aria-label="Sort stories"
    class="w-[14rem] shrink-0 py-0.5"
    :highlight-on-select="false"
    option-group-children="items"
    option-group-label="label"
    option-label="label"
    option-value="value"
    size="small">
    <template #value>
      <span class="typography-sm text-gray-700">{{ selectedSortLabel }}</span>
    </template>

    <template #optiongroup="slotProps">
      <div class="typography-sm px-3 pb-1 pt-3 tracking-[0.12em] text-gray-500">
        {{ slotProps.option.label }}
      </div>
    </template>

    <template #option="slotProps">
      <div
        :class="[
          'typography-sm mx-0 w-full rounded-md px-3 py-2',
          slotProps.selected ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
        ]">
        {{ slotProps.option.label }}
      </div>
    </template>
  </Select>
</template>
