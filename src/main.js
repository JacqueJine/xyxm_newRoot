import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { imgUrl } from './utils/auth'
import qs from 'qs'

import '@/icons' // icon
import '@/permission' // permission control 权限控制

/**
 * If you don't want to use mock-server 如果您不想使用模拟服务器
 * you want to use MockJs for mock api 您需要使用MockJs来模拟api
 * you can execute: mockXHR() 可以执行:mockXHR()
 *
 * Currently MockJs will be used in the production environment, 目前，MockJs将用于生产环境，
 * please remove it before going online ! ! !  请在上线前删除!!!
 */

import { format } from 'timeago.js';
//定义全局的过滤器 "changeTime":改变时间为几周前
Vue.filter('changeTime', function(dateStr) {
    return format(dateStr, 'zh_CN');
})
if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../mock')
    mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.prototype.IMGURL = imgUrl
Vue.config.productionTip = false
Vue.prototype.$qs = qs

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})