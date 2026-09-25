<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import IconHome from '@primeicons/vue/home';
  import NavSideBarTab from '@/components/NavSideBarTab.vue'
  import NavSideBarText from '@/components/NavSideBarText.vue'
  import { RouteNames } from '@/router/types'
  import { useNavSideBarStore } from '@/stores/navSideBar'

  const { isCollapsed } = storeToRefs(useNavSideBarStore())

  const route = useRoute()

  const selected = computed(() => route?.meta?.navBarTab === 'home')
</script>

<template>
  <li class="px-[0.5rem]">
    <RouterLink :to="{ name: RouteNames.home }" class="no-underline">
      <NavSideBarTab :selected="selected" class="justify-start">
        <IconHome :class="{ 'text-emerald-100': selected }" class="text-cyan-500 group-hover:text-emerald-100" size="24" />
        <NavSideBarText v-if="!isCollapsed" :selected="selected">
          Home
        </NavSideBarText>
      </NavSideBarTab>
    </RouterLink>
  </li>
</template>
