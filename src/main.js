/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import 'bootstrap/dist/css/bootstrap.css'
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.getElementById('app').setAttribute('data-bs-theme', 'dark')
}