<script lang="ts" setup>
  import BaseInputCheckbox, { type BaseInputCheckboxProps } from '@/components/BaseInputCheckbox.vue'

  defineProps<Pick<BaseInputCheckboxProps, 'id' | 'name' | 'disabled' | 'indeterminate'>>()
</script>

<template>
  <base-input-checkbox
    :id="id"
    :checked-value="true"
    :class="{ 'pointer-events-none': disabled }"
    :disabled="disabled"
    :indeterminate="indeterminate"
    :name="name"
    :unchecked-value="false"
    class="inline-flex items-center gap-[0.5rem] text-[1rem] dark:text-white"
    input-class="w-[1.5rem] h-[1.5rem] appearance-none border border-solid rounded-[0.1875rem] border-gray-300 hover:border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-inset focus:outline-0 focus:ring-offset-0 active:bg-blue-50 dark:bg-gray-700 checked:border-gray-400 bg-white checked:bg-[url('/checked.svg')] checked:bg-white checked:bg-cover indeterminate:bg-[url('/checkbox-indeterminate.svg')] indeterminate:bg-cover disabled:bg-gray-50 disabled:grayscale disabled:checked:brightness-[0.95] disabled:checked:grayscale">
    <slot />
  </base-input-checkbox>
</template>
