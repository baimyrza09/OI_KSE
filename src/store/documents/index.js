import Api from '../api'

const state = {}
const mutations = {}
const actions = {
  async GET_DOC_LIST() {
    try {
      const res = await Api.getDocsList()
      const {status, data} = res
      if (status === 200) {
        return data
      }
    } catch (err) {
      return err
    }
  },

  async GET_DOC_PROPS({}, name) {
    try {
      const res = await Api.getDocByName(name)
      const {status, data} = res
      if (status === 200) {
        return data
      }
    } catch (err) {
      return err
    }
  }
}
const getters = {}

const documentsModule = {
  state,
  mutations,
  actions,
  getters
}

export default documentsModule

// GET_DOC_PROPS({ }, name) {

//     return Promise.resolve(docList.find(doc => doc.name === name))
// }
