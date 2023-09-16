import 'ant-design-vue/dist/reset.css'
import 'bootstrap/dist/css/bootstrap.css'

import {createApp} from 'vue'
import App from './App.vue'
import {DatePicker} from 'ant-design-vue'
import 'bootstrap/dist/js/bootstrap.bundle.js'

// Pinia
import {createPinia} from 'pinia';


const app = createApp(App)
// AntDesign
app.use(DatePicker)
// Pinia
app.use(createPinia())
app.mount('#app')
