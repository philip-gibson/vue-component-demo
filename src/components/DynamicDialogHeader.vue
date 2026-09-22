<script lang="ts" setup>
  import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
  import { type Ref, computed, inject } from 'vue'

  const dialogRef: Ref<DynamicDialogInstance> = inject('dialogRef') ?? ({} as Ref<DynamicDialogInstance>)

  const data = computed(() => dialogRef.value?.data ?? {})
</script>
<template>
  <div class="flex items-center gap-2">
    <i v-if="data.headerIcon" :class="[data.headerIcon, '!text-xl', data.headerIconClass]"></i>
    <i v-else-if="data.isDelete" class="pi pi-exclamation-triangle !text-xl text-orange-500"></i>
    <p class="typography-xl break-words font-bold">{{ data.header }}</p>
  </div>
</template>
