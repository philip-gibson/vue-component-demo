<script lang="ts" setup>
  import SideBar from '@/components/NavSideBar.vue'
  import LayoutApplication from '@/layouts/LayoutApplication.vue'
</script>

<template>
  <LayoutApplication>
    <template #sideBar>
      <SideBar />
    </template>
    <RouterView />
  </LayoutApplication>
</template>
