// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
import VueClipboard from 'vue-clipboard2'
import VueSocketio from 'vue-socket.io'

import axios from 'axios'

// setup elementUI, vue-awesome, vue-clipboard2, and vue-socket.io
Vue.use(ElementUI)
Vue.component('icon', Icon)
Vue.use(VueClipboard)
Vue.use(VueSocketio, '/')

// add axios through the Vue object
Object.defineProperty(Vue.prototype, '$axios', { value: axios })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
