<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import IconCloud from '@primeicons/vue/cloud';
  import NavSideBarTab from '@/components/NavSideBarTab.vue'
  import NavSideBarText from '@/components/NavSideBarText.vue'
  import type { NavSideBarState } from '@/components/NavSideBar.vue'
  import { RouteNames } from '@/router/types'

  withDefaults(defineProps<NavSideBarState>(), {
    collapsed: false,
  })

  const route = useRoute()

  const selected = computed(() => route?.meta?.navBarTab === 'salesforce')
</script>

<template>
  <li class="px-[0.5rem]">
    <RouterLink :to="{ name: RouteNames.salesforce }" class="no-underline">
      <NavSideBarTab :selected="selected" class="justify-start">
        <IconCloud :class="{ 'text-emerald-100': selected }" class="text-cyan-500 group-hover:text-emerald-100" size="24" />
        <NavSideBarText v-if="!collapsed" :selected="selected">
          Salesforce
        </NavSideBarText>
      </NavSideBarTab>
    </RouterLink>
  </li>
</template>
