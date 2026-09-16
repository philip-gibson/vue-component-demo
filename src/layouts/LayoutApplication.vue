<script lang="ts" setup>
  import { zIndices } from '@/utils/zIndices'
</script>
<template>
  <div class="flex h-full w-full overflow-hidden">
    <div :class="zIndices.LAYER_30">
      <slot name="sideBar" />
    </div>
    <div class="grow overflow-hidden">
      <slot />
    </div>
  </div>
</template>
