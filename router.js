import {createRouter, createWebHistory} from 'vue-router';

import login from './src/pages/login.vue'
import tasklist from './src/pages/tasklist.vue'

const routes = [
    {path: '/', name: 'login', component: login},
    {path: '/tasklist', name: 'tasklist', component: tasklist}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;