<script lang="ts" setup>
  defineProps<{ errorMessage: string | undefined }>()
</script>

<template>
  <span v-if="errorMessage" class="w-full text-[0.75rem] leading-[0.875rem] text-red-500">
    {{ errorMessage }}
  </span>
</template>
