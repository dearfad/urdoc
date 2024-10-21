/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins"

// Components
import App from "./App.vue"

// Composables
import { createApp } from "vue"

// Axios
import axios from "axios"
axios.defaults.baseURL = "http://127.0.0.1:8000"
axios.defaults.withCredentials = true

const app = createApp(App)

registerPlugins(app)

app.mount("#app")
