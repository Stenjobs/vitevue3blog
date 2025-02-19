import { createApp } from 'vue'
import App from './App.vue'

import pinia from './pinia'
import router from './router'
import plugins from './plugins'
import Modal from "@/components/Modal/index.vue"
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'animate.css';

import '@/style/index.scss'

// 路由校验
import './permission'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.component('Modal', Modal)
app.use(plugins)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
