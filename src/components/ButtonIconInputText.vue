<script lang="ts" setup>
  import { computed, ref } from 'vue'

  export type ButtonIconInputTextProps = {
    isInputValid: boolean
    disableOnInputError?: boolean
    keyboardFocusable?: boolean
    classes?: string
  }

  const props = defineProps<ButtonIconInputTextProps>()
  const disable = computed(() => !props.isInputValid && props.disableOnInputError)
  const tabIndex = computed(() => (props.keyboardFocusable ? '0' : '-1'))
  const emit = defineEmits(['click'])

  const button = ref<HTMLButtonElement>()

  function onClick() {
    emit('click')
    button.value?.blur()
  }
</script>

<template>
  <button
    ref="button"
    :class="[
      isInputValid ? 'focus:ring-blue-500' : 'border-red-300 hover:border-red-500 focus:shadow-none focus:ring-red-500',
      { 'cursor-not-allowed': disable },
      classes,
    ]"
    :disabled="disable"
    :tabindex="tabIndex"
    class="absolute inline-flex rounded-[0.1875rem] focus:outline-0 focus:ring-2"
    type="button"
    @click.prevent="onClick"
    @keyup.enter.prevent="onClick">
    <slot />
  </button>
</template>
