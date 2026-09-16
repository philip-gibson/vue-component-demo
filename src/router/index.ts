import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { RouteNames } from '@/router/types'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/Application.vue'),
    children: [
      {
        path: '',
        redirect: { name: RouteNames.home, replace: true },
      },
      {
        path: 'home',
        component: () => import('@/views/Home.vue'),
        name: RouteNames.home,
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
