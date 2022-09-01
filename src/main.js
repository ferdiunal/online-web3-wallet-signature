import { createApp } from 'vue'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import './style.css'
import App from './App.vue'

const app = createApp(App)


app.use(Toast, {
    timeout: false
});

app.mount('#app')
