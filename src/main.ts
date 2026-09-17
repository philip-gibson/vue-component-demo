import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { installPrimeVue } from '@/plugins/prime-vue'
import { router } from '@/router'
import '@/assets/main.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

installPrimeVue(app)

app.use(router).use(pinia).mount('#app')
