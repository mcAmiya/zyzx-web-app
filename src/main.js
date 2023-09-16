import 'ant-design-vue/dist/reset.css'
import 'bootstrap/dist/css/bootstrap.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from '../router'
import { DatePicker } from 'ant-design-vue'
import 'bootstrap/dist/js/bootstrap.bundle.js'


const app = createApp(App)
// 使用页面路由
app.use(router)
// AntDesign
app.use(DatePicker)
app.mount('#app')
