import Api from '../api'

const state = {}
const mutations = {}
const actions = {
  async GET_COMPANY_DATA({}) {
    try {
      const res = await Api.getProfileInfo()
      return res.data
    } catch {
      return 'Произошла ошибка'
    }
  },
  async EDIT_COMPANY_DATA(
    {},
    {
      name,
      opforma,
      activity,
      address,
      phone,
      fax,
      email,
      supervisor,
      id,
      first_signers
    }
  ) {
    try {
      Api.editProfileInfo(
        name,
        opforma,
        activity,
        address,
        phone,
        fax,
        email,
        supervisor,
        id,
        first_signers
      )
      return true
    } catch {
      return 'Произошла ошибка'
    }
  }
}
const getters = {}

const companyModule = {
  state,
  mutations,
  actions,
  getters
}

export default companyModule
