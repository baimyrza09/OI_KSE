import DashboardLayout from '@/pages/Dashboard/Layout/DashboardLayout.vue'
import AuthLayout from '@/pages/Dashboard/Pages/AuthLayout.vue'

import Home from '@/pages/Dashboard/Dashboard.vue'
import User from '@/pages/Dashboard/Pages/UserProfile.vue'
import Login from '@/pages/Dashboard/Pages/Login.vue'
import UserPassEdit from '@/pages/Dashboard/Pages/UserPassEdit.vue'
import PrintView from '@/pages/Dashboard/Pages/PrintView.vue'
import Cart from '@/pages/Dashboard/Pages/Cart.vue'
// import AddCompany from '@/pages/Dashboard/Pages/AddCompany.vue'
import DocComponent from '@/pages/Dashboard/Pages/DocComponent.vue'
import DocsTemplatesList from '@/pages/Dashboard/Pages/DocsTemplatesList.vue'
import Manual from '@/pages/Dashboard/Pages/Manual.vue'
import Legislation from '@/pages/Dashboard/Pages/Legislation.vue'
import Reports from '@/pages/Dashboard/Pages/Reports.vue'
import ManageAccounts from '@/pages/Dashboard/Pages/ManageAccounts.vue'
import store from '@/store'

const checkAuthAndAccess = async (to, from, next) => {
  if (store.getters.hasToken) {
    store.commit('SET_HEADER_AUTH')
  }
  next()
}

let pages = {
  path: '/',
  redirect: 'auth/login',
  component: DashboardLayout,
  children: [
    {
      path: 'profile',
      name: 'User Page',
      components: {default: User},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'changepass',
      name: 'Change User Password',
      components: {default: UserPassEdit},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'template/:id/:mode',
      name: 'Document Template',
      components: {default: DocComponent},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'templates',
      name: 'Document Templates List',
      components: {default: DocsTemplatesList},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'manual',
      name: 'Manual',
      components: {default: Manual},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'legislation',
      name: 'Legislation',
      components: {default: Legislation},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'reports',
      name: 'Reports',
      components: {default: Reports},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'home',
      name: 'Home',
      components: {default: Home},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'printview/:id',
      name: 'Print View',
      components: {default: PrintView},
      beforeEnter: checkAuthAndAccess
    },
    {
      path: 'cart',
      name: 'Cart',
      components: {default: Cart},
      beforeEnter: checkAuthAndAccess
    }, 
    {
      path: 'manageaccounts',
      name: 'manageAccounts',
      components: {default: ManageAccounts},
      beforeEnter: checkAuthAndAccess
    }
  ]
}

let auth = {
  path: '/auth',
  component: AuthLayout,
  name: 'Authentication',
  children: [
    {
      path: 'login',
      name: 'Login',
      component: Login
    }
  ]
}

const routes = [pages, auth]

export default routes
