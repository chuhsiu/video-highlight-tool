/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'

async function prepareApp() {
  if (import.meta.env) {
     const { worker } = await import('./mocks/browser')
     return worker.start({
       serviceWorker: {
         url: import.meta.env.VITE_MSW_PATH,
       },
     })
   }
 
   return Promise.resolve()
 }
// Styles
import 'unfonts.css'

const pinia = createPinia()
const app = createApp(App)

registerPlugins(app)
prepareApp().then(() => {
    app.use(pinia)
    app.mount('#app')
})
