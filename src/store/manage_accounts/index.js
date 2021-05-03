import axios from 'axios'
import Api from '../api'

export default {
  actions: {
    async getUserList({commit}) {
      try {
        const {data} = await Api.UserList()
        commit('setUsersList', data)
      } catch (error) {}
    },

    async resetUser({commit}, id) {
      try {
        const res = await Api.resetUserPassword({user_id: id})
        if (res.status == 200) {
          commit('toggleShowSnackbar', true)
        }
        setTimeout(() => {
          commit('toggleShowSnackbar', false)
        }, 5000)
      } catch (error) {
        commit('toggleShowSnackbar', false)
      }
    },
    closeShowSnackbar({commit}) {
      commit('toggleShowSnackbar', false)
    },

    async showModalMAAC({commit}) {
      commit('toggleShowModal', true)
    },

    async closeModalMAAC({commit}) {
      commit('toggleShowModal', false)
    },

    async addNewCompany({commit}, data) {
      try {
        console.log('test2')
        console.log(data)
        let res = await Api.newCompany(data.company)
        console.log(res.data)
        console.log(res.status)
        if (res.status === 200) {
          let user = {
            login: data.login,
            idcompany: res.data.idCompany
          }
          await Api.newCompanyUser(user)
        }
        // commit('toggleShowModal', false)
      } catch (error) {}
    }
  },
  mutations: {
    setUsersList(state, users) {
      state.users = users
    },
    toggleShowSnackbar(state, data) {
      state.showSnackbar = data
    },
    toggleShowModal(state, data) {
      state.showModal = data
    }
  },
  state: {
    users: [],
    showSnackbar: false,
    msgpass: '',
    showModal: false
  },
  getters: {
    getAllUsersList(state) {
      return state.users
    },
    getShowSnackbar(state) {
      return state.showSnackbar
    },
    getShowModal(state) {
      return state.showModal
    }
  }
}
