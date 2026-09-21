<script lang="ts" setup>
  import { onMounted, ref } from 'vue'

  import ButtonIconInputText, { type ButtonIconInputTextProps } from '@/components/ButtonIconInputText.vue'
  import IconSpinner from '@primeicons/vue/spinner'
  import IconAsterisk from '@primeicons/vue/asterisk'
  import InputErrorMessage from '@/components/InputErrorMessage.vue'
  import { useValidatedField } from '@/composables/useValidatedField'

  export type ButtonProps = Partial<Omit<ButtonIconInputTextProps, 'isInputValid'>>

  export type InputTextProps = {
    id: string
    name: string
    type?: string
    compact?: boolean
    required?: boolean
    placeholder?: string
    validateOnBlur?: boolean
    validateOnKeypress?: boolean
    autocomplete?: 'on' | 'off'
    buttonEndProps?: ButtonProps
    disabled?: boolean
    loading?: boolean
  }

  const props = withDefaults(defineProps<InputTextProps>(), {
    type: 'text',
    compact: false,
    required: false,
    placeholder: '',
    autocomplete: 'on',
    validateOnBlur: false,
    validateOnKeypress: false,
    buttonEndProps: () => ({
      disableOnInputError: false,
      keyboardFocusable: true,
      classes: '',
    }),
    disabled: false,
    loading: false,
  })

  const emit = defineEmits<{
    'enter:input': [void]
    'update:input': [value: string]
    'click:button-icon-end': [void]
    'cleared:input': [void]
  }>()

  const { value, errorMessage, setValue, validationListeners } = useValidatedField<string>(
    props.name,
    props.validateOnKeypress,
    props.validateOnBlur
  )
  const input = ref<HTMLInputElement>()

  const validateAndSetValue = (value: string) => setValue(value, true)

  function clear() {
    validateAndSetValue('')
    emit('cleared:input')
  }

  onMounted(() => {
    if (!input.value) throw new Error('Input ref is undefined.')
  })

  function emitAndFocusInput() {
    emit('click:button-icon-end')
    input.value?.focus()
  }

  const focus = () => {
    input.value?.focus()
  }

  defineExpose({
    focus,
  })
</script>

<template>
  <label
    :for="id"
    class="flex flex-col items-start gap-y-[0.25rem] text-[0.875rem] font-medium leading-[1.25rem] dark:text-white">
    <span v-if="required" class="flex text-[0.875rem] font-medium leading-[1.25rem] dark:text-white">
      <slot name="label" /><span class="flex">&nbsp;<IconAsterisk /></span>
    </span>
    <slot v-else name="label" />
    <span class="flex w-full items-center justify-center">
      <input
        :id="id"
        ref="input"
        :autocomplete="autocomplete"
        :class="[
          {
            'border-red-300 hover:border-red-500 focus:border-red-500 focus:shadow-none focus:ring-red-500':
              errorMessage,
            '!px-[0.5rem] !text-[0.875rem] !leading-[1.25rem]': compact,
            'cursor-not-allowed border-gray-300 bg-gray-50': disabled,
            'pl-[2.5rem]': $slots['icon-start'],
            'pr-[2.5rem]': $slots['icon-end'],
          },
        ]"
        :disabled="disabled"
        :placeholder="placeholder"
        :type="type"
        :value="value"
        class="w-full rounded-[0.1875rem] border border-solid border-gray-300 px-[0.75rem] py-[0.375rem] text-[1rem] font-[400]
          leading-[1.75rem] text-black hover:border-gray-500 focus:border-blue-500 focus:outline-0 focus:ring-1 focus:ring-inset
          focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-300"
        @input="$emit('update:input', ($event.target as HTMLInputElement).value)"
        v-on="validationListeners"
        @keyup.enter="$emit('enter:input')" />
      <slot name="icon-start" />
      <IconSpinner v-if="loading" class="pointer-events-none absolute right-[0.75rem] h-[1.5rem] w-[1.5rem]" />
      <button-icon-input-text
        v-if="$slots['icon-end']"
        :is-input-valid="!errorMessage"
        class="right-[0.75rem]"
        v-bind="buttonEndProps"
        @click="emitAndFocusInput()">
        <slot name="icon-end" />
      </button-icon-input-text>
    </span>
    <input-error-message :error-message="errorMessage" />
  </label>
</template>
