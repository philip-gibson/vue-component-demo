<script lang="ts" setup>
  import Button from 'primevue/button'
  import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
  import InputText from 'primevue/inputtext'
  import { type Ref, computed, inject, ref } from 'vue'

  const dialogRef: Ref<DynamicDialogInstance> = inject('dialogRef') ?? ({} as Ref<DynamicDialogInstance>)

  const emit = defineEmits<{
    cancel: [void]
    confirm: [void]
  }>()

  const deleteInputValue = ref('')

  const data = computed(() => dialogRef.value?.data ?? {})
  const isConfirming = computed(() => data.value.isConfirming?.value === true)
  const isConfirmButtonDisabled = computed(() => {
    if (isConfirming.value) return true
    return data.value.isDelete && deleteInputValue.value !== 'DELETE'
  })
</script>
<template>
  <div class="flex w-full flex-col gap-4">
    <div v-if="data.isDelete">
      <InputText
        id="delete-confirmation-input"
        v-model="deleteInputValue"
        aria-label="Type DELETE to confirm"
        autocomplete="off"
        fluid
        placeholder="Type here..." />
    </div>
    <div :class="['flex', data.cancelOnly ? 'justify-end' : 'justify-between']">
      <Button :label="data.cancelLabel ?? 'Cancel'" :outlined="!data.cancelOnly" @click="$emit('cancel')" />
      <Button
        v-if="!data.cancelOnly"
        :label="data.confirmLabel"
        :severity="data.severity ?? 'primary'"
        :disabled="isConfirmButtonDisabled"
        :loading="isConfirming"
        @click="$emit('confirm')" />
    </div>
  </div>
</template>
