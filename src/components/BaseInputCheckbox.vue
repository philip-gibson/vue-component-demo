<script lang="ts" setup>
  import { useField } from 'vee-validate'
  import { onMounted, ref } from 'vue'

  export type BaseInputCheckboxProps = {
    id: string
    inputClass: string
    name: string
    checkedValue: unknown
    uncheckedValue?: unknown
    indeterminate?: boolean
    // required by `syncVModel`
    modelValue?: unknown
    keyboardFocusable?: boolean
    disabled?: boolean
  }

  const props = defineProps<BaseInputCheckboxProps>()

  // rules is undefined because we do form level validation
  const { checked, handleChange } = useField(() => props.name, undefined, {
    type: 'checkbox',
    checkedValue: props.checkedValue,
    uncheckedValue: props.uncheckedValue,
    syncVModel: true,
  })

  const label = ref<HTMLElement>()
  const keyup = (evt: KeyboardEvent) => {
    if (evt.code === 'Space') handleChange(evt)
  }

  const checkForInteractiveProperties = () => {
    if (label.value && props.keyboardFocusable) {
      label.value.role = 'button'
      label.value.tabIndex = 0
      label.value.addEventListener('keyup', keyup)
    }
  }

  onMounted(() => {
    checkForInteractiveProperties()
  })
</script>

<template>
  <label ref="label" :for="id" :class="{ 'cursor-not-allowed': disabled }">
    <input
      :id="id"
      :checked="checked"
      :class="inputClass"
      :disabled="disabled"
      :indeterminate="indeterminate"
      :value="checkedValue"
      type="checkbox"
      @change="handleChange" />
    <slot />
  </label>
</template>
