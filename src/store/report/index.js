import Api from '../api'
const state = {}
const mutations = {}
const actions = {
  async INSERT_REPORT(
    {},

    {docslayoutid, typedoc, xmldoc, sender, status, kvartal}
  ) {
    try {
      const res = await Api.insertReport(
        docslayoutid,
        typedoc,
        xmldoc,
        sender,
        status,
        kvartal
      )

      return res
    } catch (err) {
      return err
    }
  },

  async UPDATE_REPORT({}, {id, doc, status, kvartal, typedoc}) {
    try {
      const res = await Api.updateReport(id, doc, status, kvartal, typedoc)

      return true
    } catch (err) {
      return err
    }
  },

  async DELETE_REPORT({}, id) {
    try {
      // const res = await
      Api.deleteReport(id)
      return true
    } catch (err) {
      return err
    }
  },
  async GET_REPORT_LIST() {
    try {
      const res = await Api.getReportList()
      const {status, data} = res
      if (status === 200) {
        return data
      }
    } catch (err) {
      return err
    }
  },
  async GET_REPORT_BY_ID({}, id) {
    try {
      const res = await Api.getReportById(id)
      return res.data
    } catch (err) {
      return err
    }
  },
  async SEND_REPORT_TO_ADMIN({}, {id, type}) {
    try {
      Api.sendReport(id, type)
      return true
    } catch (err) {
      return err
    }
  },
  async GET_USER_PIN({}) {
    try {
      let res = await Api.getUserPin()
      console.log(res, '1')
      return res
    } catch (error) {
      return error.response.data.message
    } 
  },
  async SIGN_REPORT({}, {id, pin, order}) {
    try {
      const res = await Api.signReport(id, pin, order)
      console.log(res, '2')
      return res
    } catch (err) {
      return err
    }
  },
  async CHECK_SIGN_REPORT({}, {id, order}) {
    try {
      const res = await Api.checkSignReport(id, order)
      console.log(res, '3')
      return res
    } catch (err) {
      return err
    }
  },
  async GET_REPORT_RECEIPT({}, {id, companyName, typedoc, kvartal, datesend}) {
    try {
      let date = new Date(datesend)
      let newDate = date.toLocaleDateString()
      const res = await Api.getDocByName('receipt')
      if (res.status === 200) {
        const data = res.data
        data.fields[1].value = companyName
        data.fields[2].value = typedoc
        data.fields[3].value = newDate
        data.fields[4].value = id
        const query = await Api.insertReport(
          28,
          'Квитанция',
          JSON.stringify(data),
          'admin',
          1,
          kvartal
        )
        if (query.status === 200) {
          let ref = query.data.idReport
          const confirm = await Api.confirmReport(id, sender, ref)
          if(confirm.status === 200){
            return true
          }
        }
      }
    } catch (err) {
      return err
    }
  },

  async CONFIRM_REPORT({}, {id, sender, ref}) {
    try {
     let res = await Api.confirmReport(id, sender, ref)
     return res
    } catch (err) {
      return err
    }
  },
  //отправка сущ факта
  async SEND_NEWS_TO_KSE(
    {},
    {doAddEntry, BlogId, mEntryText, mEntryName, mEntryCompany, titles}
  ) {
    try {
      let res = await Api.addNewsToKSE(
        doAddEntry,
        BlogId,
        mEntryText,
        mEntryName,
        mEntryCompany,
        titles
      )
      return res
    } catch (err) {
      return err
    }
  },
  async SEND_REPORTS_TO_KSE({}, {doc, kvartal, company_name}) {
    try {
      let res = await Api.addReportToKSE(doc, kvartal, company_name)
      return res
    } catch (err) {
      return err
    }
  },
  async ADD_LINK_TO_KSE({}, {idfact, link}) {
    try {
      Api.addLinkToFact(idfact, link)
      return true
    } catch (err) {
      return err
    }
  },
  async REVOKE_REPORT({}, id) {
    try {
      Api.revokeReport(id)
      return true
    } catch (err) {
      return err
    }
  },
  async REJECT_REPORT({}, id) {
    try {
      Api.rejectReport(id)
      return true
    } catch (err) {
      return err
    }
  },
  async MOVE_TO_CART_REPORT({}, id) {
    try {
      Api.moveToCartReport(id)
      return true
    } catch (err) {
      return err
    }
  },
  async GET_CART_LIST({}) {
    try {
      const res = await Api.getCartList()
      const {status, data} = res
      if (status === 200) {
        return data
      }
    } catch (err) {
      return err
    }
  },
  async DELETE_REPORT_FROM_CART({}, id) {
    try {
      Api.deleteReportFromCart(id)
      return true
    } catch (err) {
      return err
    }
  },
  async RESTORE_REPORT_FROM_CART({}, id) {
    try { 
      Api.restoreReportFromCart(id)
      return true
    } catch (err) {
      return err
    }
  }
}
const getters = {}
const reportModule = {
  state,
  mutations,
  actions,
  getters
}
export default reportModule
