// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import iEditor from 'iview-editor'
import VueParticles from 'vue-particles'
import 'iview/dist/styles/iview.css'
import 'iview-editor/dist/iview-editor.css'
import './common/css/reset.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios

Vue.use(iView)
Vue.use(iEditor)
Vue.use(VueParticles)
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
