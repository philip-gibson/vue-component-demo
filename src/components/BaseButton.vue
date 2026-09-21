<script lang="ts" setup>
  import { computed } from 'vue'

  export type Size = 'sm' | 'md' | 'lg' | 'xl'

  const props = defineProps<{
    variantClass: string
    size: Size
    type?: 'submit' | 'button' | 'reset'
  }>()

  const sizeRelatedClass: { [key in Size]: string } = {
    sm: 'h-[2rem] px-[1rem] py-[0.375rem] gap-[0.25rem] text-[0.875rem] font-medium leading-[1.25rem]',
    md: 'h-[2.5rem] px-[1rem] py-[0.75rem] gap-[0.5rem] text-[1rem] font-medium leading-[1rem]',
    lg: 'h-[3rem] px-[1.25rem] py-[1rem] gap-[0.5rem] text-[1rem] font-semibold leading-[1rem]',
    xl: 'h-[4rem] px-[1.5rem] py-[1rem] gap-[0.75rem] text-[1.25rem] font-medium leading-[2rem]',
  }

  const buttonClass = computed(() => props.variantClass + ' ' + sizeRelatedClass[props.size])
  const buttonType = computed(() => props.type || 'submit')
</script>

<template>
  <button :class="buttonClass" class="inline-flex items-center justify-center rounded-[0.1875rem]" :type="buttonType">
    <slot />
  </button>
</template>
