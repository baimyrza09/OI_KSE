//---------------------------- axios запросы на бэкенд ----------------------------------//

import axios from 'axios'

const Api = axios.create({
  // baseURL: 'https://m.kse.kg/api',
  baseURL: 'http://localhost:8088/api',
  headers: {
    Accept: 'application/json'
    // Authorization: 'Bearer'
  }
})

export default {
  // --------------------------Настройка axios----------------------- //
  // заголовок
  setHeaderAuth(token) {
    Api.defaults.headers['Authorization'] = `Bearer ${token}`
  },
  delHeaderAuth() {
    delete Api.defaults.headers.common['Authorization']
  },
  isSetHeaderAuth() {
    const authHeader = Api.defaults.headers['Authorization']
    return /Bearer (.*)/i.test(authHeader)
  },
  // --------------------------Авторизация-------------------------- //
  // авторизация в системе
  login(login, password) {
    return Api.post('/users/auth', {login, password})
  },
  // получение информации о пользователе
  getMe() {
    return Api.get('/users/me')
  },
  UserList(){
    return Api.get('/accounts/')
  },

  resetUserPassword(id){
    return Api.put('/accounts/', id)
  },
  // обновление пароля
  changePass(password) {
    return Api.put('/users/password', {password})
  },

  updateInn(data){
    return Api.put('/users/userinn', data)
  },

  getUserInn(){
    return Api.get('/users/userinn')
  },

   // добавление новой компании
  newCompany(data){
    return Api.post('/company/', data)
  },

  newCompanyUser(data){
    return Api.post('/company/user', data)
  },
  // ---------------------------Профиль----------------------------- //
  // получение информации о компании
  getProfileInfo() {
    return Api.get('/company/')
  },
  // обновление информации о компании
  editProfileInfo(
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
  ) {
    return Api.put('/company/', {
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
    })
  },

  // --------------------------Отчеты-------------------------------- //

  // добавление нового отчета
  insertReport(docslayoutid, typedoc, xmldoc, sender, status, kvartal) {
    return Api.post('/reports', {
      docslayoutid,
      typedoc,
      xmldoc,
      sender,
      status,
      kvartal
    })
  },
  // обновление отчет по id
  updateReport(id, doc, status, kvartal, typedoc) {
    return Api.put('/reports/' + id, {id, doc, status, kvartal, typedoc})
  },
  // удаление отчета по id
  deleteReport(id) {
    return Api.delete('/reports/delete/' + id)
  },
  // получение отчетов по токену
  getReportList() {
    return Api.get('/reports/allreports/', {})
  },
  // получение отчета по id
  getReportById(id) {
    return Api.get('/reports/' + id, {
      headers: {'Content-Type': 'Applicationjson'}
    })
  },
  // отправка отчета администратору
  sendReport(id, type) {
    return Api.put('/reports/status/' + id, {id, type})
  },
  // отмена на отправку к админу
  revokeReport(id) {
    return Api.put('/reports/back/' + id)
  },
  // отклонение документа администратором
  rejectReport(id) {
    return Api.put('/reports/reject/' + id)
  },
  // правильно
  moveToCartReport(id) {
    return Api.delete('/reports/' + id)
  },
  // принятие документа администратором
  confirmReport(id, interrefer, ref) {
    return Api.put('/reports/demo/', {id, interrefer, ref})
  },
  // отправка существенного факта на сайт kse.kg
  addNewsToKSE(
    doAddEntry,
    BlogId,
    mEntryText,
    mEntryName,
    mEntryCompany,
    title
  ) {
    return axios({
      method: 'POST',
      url: 'https://www.kse.kg/modules/Blog/addFact.php',
      data: {
        doAddEntry,
        BlogId,
        mEntryText,
        mEntryName,
        mEntryCompany,
        title
      }
    })
  },
  // отправка отчета на сайт kse.kg
  addReportToKSE(doc, kvartal, company_name) {
    return axios({
      method: 'POST',
      url: 'https://www.kse.kg/modules/Blog/addReportfromDemo.php',
      data: {
        doc,
        kvartal,
        company_name
      }
    })
  },
  // добавление ссылки на сайт kse.kg
  addLinkToFact(idfact, link) {
    return Api.put('/reports/link/' + link, {idfact, link})
  },
  // --------------------------Шаблоны документов-------------------------------- //

  // получение по названию шаблона документа
  getDocByName(name) {
    return Api.get('/documents/doc/' + name, {
      headers: {'Content-Type': 'Applicationjson'}
    })
  },
  // получение всех шаблонов документов
  getDocsList() {
    return Api.get('/documents/docsList/', {
      headers: {'Content-Type': 'Applicationjson'}
    })
  },
  // Список удаленных отчетов
  getCartList() {
    return Api.get('/reports/allDelreports')
  },
  // удаление документа с корзины
  deleteReportFromCart(id) {
    return Api.delete('/reports/deletingForever/' + id)
  },
  // восстановление документа с корзины
  restoreReportFromCart(id) {
    return Api.delete('/reports/recoverDoc/' + id)
  },
  getUserPin() {
    return Api.get('/eds')
  },
  signReport(id_doc, pin,order) {
    return Api.post('/eds/'+ order, {id_doc, pin})
  },
  checkSignReport(id_doc, order) {
    return Api.post('/eds/check-sign/'+ order, {id_doc})
  }
}
