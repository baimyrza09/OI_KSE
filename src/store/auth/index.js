import Api from '../api'

const state = {
  status: '',
  token: localStorage.getItem('token') || '',
  user: '',
  inn: '',
  showSnackbar: false
}
const mutations = {
  SET_HEADER_AUTH: (state) => {
    if (!Api.isSetHeaderAuth()) {
      Api.setHeaderAuth(state.token)
    }
  },

  AUTH_SUCCESS(state, token, user) {
    state.status = 'success'
    state.token = token
    state.user = user
    console.log(user)
  },
  LOGOUT(state) {
    state.status = ''
    state.token = ''
  },
  SUCCES_INN(state, inn) {
    state.inn = inn
  },
  toggleShowSnackbar(state, data) {
    state.showSnackbar = data
  }
}
const actions = {
  async LOGIN({commit}, user) {
    try {
      const res = await Api.login(user.login, user.password)
      const token = res.data.jwt
      const role = res.data.role
      localStorage.setItem('user', role)
      localStorage.setItem('token', token)
      Api.setHeaderAuth(token)
      commit('AUTH_SUCCESS', token, user)
      return true
    } catch {
      return false
    }
  },

  async LOGOUT({commit}) {
    try {
      commit('LOGOUT')
      localStorage.removeItem('token')
      Api.delHeaderAuth()
    } catch (err) {
      return err
    }
  },

  async GET_ME({}) {
    try {
      const res = await Api.getMe()
      const login = res.data.login
      localStorage.setItem('login', login)
      return res
    } catch (err) {
      return err
    }
  },
  async CHANGE_PASS({}, password) {
    try {
      const res = await Api.changePass(password)
      const status = res.status
      if (status == 200) {
        return true
      }
    } catch (err) {
      return err
    }
  },
  async USER_INN({commit}, data) {
    try {
      const res = await Api.updateInn(data)
      const status = res.status
      if (status == 204) {
        commit('toggleShowSnackbar', true)
      }
      setTimeout(() => {
        commit('toggleShowSnackbar', false)
      }, 5000)
    } catch (error) {
      commit('toggleShowSnackbar', false)
    }
  },

  async GET_USER_INN({commit}) {
    try {
      const res = await Api.getUserInn()
      const status = res.status
      if (status == 200) {
        commit('SUCCES_INN', res.data)
      }
    } catch (error) {
    }
  }
}
const getters = {
  isLoggedIn: (state) => state.token,
  hasToken: (state) => Boolean(state.token),
  authStatus: (state) => state.status,
  userInn: (state) => state.inn,
  // getShowSnackbarUPE: (state)  => state.showSnackbar
  getShowSnackbarUPE(state) {
    return state.showSnackbar
  }
}

const authModule = {
  state,
  mutations,
  actions,
  getters
}

export default authModule
