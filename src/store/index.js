import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth/index'
import company from './company/index'
import documents from './documents/index'
import report from './report/index'
import manage_accounts from './manage_accounts/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    company,
    documents,
    report,
    manage_accounts
  }
})
