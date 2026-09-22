import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { RouteNames } from '@/router/types'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/Application.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Home.vue'),
        meta: { navBarTab: 'home', title: 'Home' },
        name: RouteNames.home,
      },
      {
        path: 'inputs',
        component: () => import('@/views/Inputs.vue'),
        meta: { navBarTab: 'inputs', title: 'Inputs' },
        name: RouteNames.inputs,
      },
      {
        path: 'primevue',
        component: () => import('@/views/PrimeVue.vue'),
        meta: { navBarTab: 'primevue', title: 'PrimeVue' },
        name: RouteNames.primevue,
      },
      {
        path: 'salesforce',
        component: () => import('@/views/Salesforce.vue'),
        meta: { navBarTab: 'salesforce', title: 'PrimeVue' },
        name: RouteNames.salesforce,
      },
      {
        path: 'stories',
        component: () => import('@/views/Stories.vue'),
        meta: { navBarTab: 'stories', title: 'Stories' },
        name: RouteNames.stories,
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/NotFound.vue'),
    name: RouteNames.notFound,
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteNames.notKnown,
    component: () => import('@/views/NotFound.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
