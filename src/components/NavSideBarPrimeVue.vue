<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import IconPrime from '@primeicons/vue/prime';
  import NavSideBarTab from '@/components/NavSideBarTab.vue'
  import NavSideBarText from '@/components/NavSideBarText.vue'
  import type { NavSideBarState } from '@/components/NavSideBar.vue'
  import { RouteNames } from '@/router/types'

  withDefaults(defineProps<NavSideBarState>(), {
    collapsed: false,
  })

  const route = useRoute()

  const selected = computed(() => route?.meta?.navBarTab === 'primevue')
</script>

<template>
  <li class="px-[0.5rem]">
    <RouterLink :to="{ name: RouteNames.primevue }" class="no-underline">
      <NavSideBarTab :selected="selected" class="justify-start">
        <IconPrime :class="{ 'text-emerald-100': selected }" class="text-cyan-500 group-hover:text-emerald-100" size="24" />
        <NavSideBarText v-if="!collapsed" :selected="selected">
          PrimeVue
        </NavSideBarText>
      </NavSideBarTab>
    </RouterLink>
  </li>
</template>
