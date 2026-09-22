<script lang="ts" setup>
  import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
  import { type Ref, computed, inject } from 'vue'

  const dialogRef: Ref<DynamicDialogInstance> = inject('dialogRef') ?? ({} as Ref<DynamicDialogInstance>)

  const data = computed(() => dialogRef.value?.data ?? {})
  const isMessageComponent = computed(() => 'messageComponent' in data.value)
</script>
<template>
  <div class="flex min-h-[6.25rem] max-w-[30rem] flex-col gap-4">
    <component :is="data.messageComponent" v-if="isMessageComponent" v-bind="data.messageProps || {}" />
    <p v-else class="typography-base leading-[1.5]">
      {{ data.message }}
    </p>

    <p v-if="data.isDelete" class="typography-base leading-[1.5]">
      To continue, type "DELETE" in the field below and click the "{{ data.confirmLabel }}" button.
    </p>

    <ul v-if="data.list" class="flex flex-col gap-2">
      <p class="typography-base font-bold">{{ data.listOf }}</p>
      <li v-for="(item, index) in data.list" :key="index">
        <p class="typography-base leading-[1.5]">{{ item }}</p>
      </li>
    </ul>
  </div>
</template>
