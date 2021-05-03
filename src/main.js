// =========================================================
// * Vue Material Dashboard PRO - v1.3.1
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardPlugin from './material-dashboard'
// import FlagIcon from 'vue-flag-icon'

// Plugins
import VueHtmlToPaper from 'vue-html-to-paper'
import App from './App.vue'
import Chartist from 'chartist'
import {i18n} from './store/i18n'
// router setup
import routes from './routes/routes'
import store from './store'
// plugin setup
// Vue.use(FlagIcon);
Vue.use(VueRouter)
Vue.use(DashboardPlugin)
Vue.use(VueHtmlToPaper)
// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return {x: 0, y: 0}
    }
  },

  linkExactActiveClass: 'nav-item active'
})

router.beforeEach((to, from, next) => {
  const isAuthen = localStorage.getItem('token')
  if (to.name === 'Login' && isAuthen !== null) {
    next(router.go(1))
  } else if (to.name !== 'Login' && isAuthen === null) next('/auth/login')
  else next()
})

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get() {
    return this.$root.Chartist
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h) => h(App),
  store,
  router,
  i18n,
  VueHtmlToPaper,
  data: {
    Chartist: Chartist
  }
})
