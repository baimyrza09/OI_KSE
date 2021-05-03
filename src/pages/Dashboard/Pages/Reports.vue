<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>assignment</md-icon>
            </div>
            <h4 class="title">Отчеты</h4>
          </md-card-header>
          <md-card-content>
            <md-table
              :value="queriedData"
              :md-sort.sync="currentSort"
              :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort"
              class="paginated-table table-hover"
            >
              <md-table-toolbar>
                <md-field>
                  <label for="pages">Документов на странице</label>
                  <md-select v-model="pagination.perPage" name="pages">
                    <md-option
                      v-for="item in pagination.perPageOptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                      {{ item }}
                    </md-option>
                  </md-select>
                </md-field>

                <md-field>
                  <md-input
                    type="search"
                    class="mb-3"
                    clearable
                    style="width: 200px"
                    placeholder="Поиск по названию"
                    v-model="searchQuery"
                  ></md-input>
                </md-field>
              </md-table-toolbar>

              <md-table-row
                style="width=500px"
                slot="md-table-row"
                slot-scope="{item}"
              >
                <md-table-cell md-label="Наименование компании">
                  {{ item.name }}
                </md-table-cell>
                <md-table-cell md-label="Статус">
                  {{ getStatus(item.status) }}
                </md-table-cell>
                <md-table-cell md-label="Дата отправки / принятия ">
                  {{ getDate(item.datesend) }} / {{ getDate(item.confirmdate) }}
                </md-table-cell>
                <md-table-cell md-label="Тип документа">
                  <a
                    class="clip"
                    v-on:click="pushToPrintView(item.id)"
                    :title="item.typedoc"
                  >
                    {{ item.typedoc }}
                  </a>
                </md-table-cell>
                <md-table-cell md-label="Период">
                  {{ item.kvartal }}
                </md-table-cell>
                <md-table-cell md-label="Cсылка">
                  <a
                    v-if="item.typedoc.includes('факт')"
                    :href="
                      'http://www.kse.kg/ru/RussianAllNewsBlog/' + item.linkkse
                    "
                    target="_blank"
                  >
                    {{ item.linkkse }}
                  </a>
                  <a
                    v-else
                    :href="
                      'http://www.kse.kg/files/BusinessReports/' + item.linkkse
                    "
                    target="_blank"
                  >
                    {{ item.linkkse }}
                  </a>
                </md-table-cell>
                <md-table-cell md-label="Подпись">
                  <md-button
                    title="Проверить первую подпись"
                    v-if="item.first_sign"
                    class="md-just-icon md-simple md-primary"
                    @click.native="checkSignHandler(item.id, 1)"
                  >
                    <span class="material-icons">verified</span>
                  </md-button>
                  <md-button
                    title="Проверить вторую подпись"
                    v-if="item.second_sign"
                    class="md-just-icon md-simple md-primary"
                    @click.native="checkSignHandler(item.id, 1)"
                  >
                    <span class="material-icons">verified</span>
                  </md-button>
                </md-table-cell>

                <md-table-cell>
                  <template
                    v-if="isUser && (item.status === 1 || item.status === 4)"
                  >
                    <div class="md-group">
                      <md-button
                        title="Редактировать"
                        class="md-just-icon md-simple md-info"
                        @click.native="editHandler(item.id)"
                      >
                        <span class="material-icons">create</span>
                      </md-button>
                      <md-button
                        title="Удалить"
                        class="md-just-icon md-simple md-danger"
                        @click.native="deleteHandler(item.id)"
                      >
                        <span class="material-icons">delete_forever</span>
                      </md-button>
                      <template v-if="item.is_first_signer">
                        <md-button
                          title="Подписать"
                          class="md-just-icon md-simple md-primary"
                          @click.native="signHandler(item.id, 1)"
                        >
                          <span class="material-icons">fact_check</span>
                        </md-button></template
                      >
                    </div>
                  </template>
                  <template v-if="isUser && item.status === 5">
                    <md-button
                      v-if="!item.is_2sign_available"
                      title="Отправить"
                      class="md-just-icon md-simple md-info"
                      @click.native="sendHandler(item.id, item.typedoc)"
                    >
                      <span class="material-icons">send</span>
                    </md-button>

                    <md-button
                      v-if="item.is_second_signer"
                      class="md-primary custom-edit-button"
                      v-on:click="signHandler(item.id, 2)"
                    >
                      подписать
                    </md-button>
                  </template>
                  <template
                    v-if="isUser && (item.status === 6 || item.status === 3)"
                  >
                    <md-button
                      title="Отправить"
                      class="md-just-icon md-simple md-info"
                      @click.native="sendHandler(item.id, item.typedoc)"
                    >
                      <span class="material-icons">send</span>
                    </md-button>
                    <!-- <md-button
                      v-if="!is_2sign_available"
                      title="Отправить"
                      class="md-just-icon md-simple md-info"
                      @click.native="sendHandler(item.id, item.typedoc)"
                    >
                      <span class="material-icons">send</span>
                    </md-button> -->
                  </template>
                  <template v-if="isUser && item.status === 2">
                    <md-button
                      class="md-warning custom-edit-button"
                      v-on:click="revokeHandler(item.id)"
                    >
                      отменить отправку
                    </md-button>
                  </template>
                  <template v-if="isAdmin && item.status === 2">
                    <div class="md-group">
                      <md-button
                        class="md-just-icon md-simple md-success"
                        @click.native="
                          confirmHandler(
                            item.id,
                            item.sender,
                            item.typedoc,
                            item.doc,
                            item.name,
                            item.kvartal,
                            item.datesend
                          )
                        "
                      >
                        <span class="material-icons">check_circle_outline</span>
                      </md-button>
                      <md-button
                        class="md-just-icon md-simple md-danger"
                        @click.native="rejectHandler(item.id)"
                      >
                        <span class="material-icons">cancel</span>
                      </md-button>
                      <md-button
                        class="md-just-icon md-simple md-warning"
                        @click.native="toCartHandler(item.id)"
                      >
                        <span class="material-icons">delete</span>
                      </md-button>
                    </div>
                  </template>
                  <template v-if="(isUser || isAdmin) && item.status === 3">
                    <md-button
                      class="md-default custom-edit-button"
                      @click.native="refHandler(item.ref)"
                    >
                      квитанция

                      <!-- <label for=""></label>
                      <label for=""></label> -->
                    </md-button>
                  </template>
                </md-table-cell>
              </md-table-row>
            </md-table>
            <div class="footer-table md-table">
              <table>
                <tfoot>
                  <tr>
                    <th
                      v-for="item in footerTable"
                      :key="item.name"
                      class="md-table-head"
                    >
                      <div
                        class="md-table-head-container md-ripple md-disabled"
                      >
                        <div class="md-table-head-label">
                          {{ item }}
                        </div>
                      </div>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </md-card-content>
          <md-card-actions md-alignment="space-between">
            <div class="">
              <p class="card-category">
                Показано с {{ from + 1 }} по {{ to }} из {{ total }} документов
              </p>
            </div>
            <pagination
              class="pagination-no-border pagination-success"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="total"
            ></pagination>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import {Pagination} from '@/components'
import Fuse from 'fuse.js'
import Swal from 'sweetalert2'
export default {
  async created() {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    if (localStorage.getItem('user') === 'user') {
      this.isUser = true
    } else if (localStorage.getItem('user') === 'admin') {
      this.isAdmin = true
    }
  },
  components: {
    Pagination
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData
      if (this.searchedData.length > 0) {
        result = this.searchedData
      }
      return result.slice(this.from, this.to)
    },
    to() {
      let highBound = this.from + this.pagination.perPage
      if (this.total < highBound) {
        highBound = this.total
      }
      return highBound
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1)
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.tableData.length
    }
  },
  data() {
    return {
      isUser: false,
      isAdmin: false,
      currentSort: 'title',
      currentSortOrder: 'desc',
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      footerTable: [
        // 'Наименование компании',
        // 'Статус документа',
        // 'Дата регистрации',
        // 'Тип документа',
      ],
      searchQuery: '',
      propsToSearch: ['typedoc', 'name', 'kvartal'],
      tableData: [],
      searchedData: [],
      fuseSearch: null
    }
  },

  methods: {
    pushToPrintView(id) {
      this.$router.push({path: '/printview/' + id})
    },
    editHandler(id) {
      this.$router.push({path: '/template/' + id + '/' + 'edit'})
    },
    refHandler(id) {
      this.$router.push({path: '/printview/' + id})
    },
    deleteHandler(id) {
      Swal.fire({
        title: '',
        text: `Вы уверены, что хотите удалить? После удаления невозможно будет восстановить документ!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'md-button md-success',
        cancelButtonClass: 'md-button md-danger',
        cancelButtonText: 'Закрыть',
        confirmButtonText: 'Да, удалить!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          if (this.$store.dispatch('DELETE_REPORT', id)) {
            let index = this.tableData.findIndex((el) => el.id === id)
            this.tableData.splice(index, 1)
            Swal.fire({
              title: 'Удален!',
              text: 'Ваш документ был  успешно удален!',
              type: 'success',
              confirmButtonClass: 'md-button md-success',
              buttonsStyling: false
            })
          }
        }
      })
    },
    async signHandler(id, order) {
      Swal.fire({
        title: '',
        text: `Вы уверены, что хотите подписать документ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'md-button md-success',
        cancelButtonClass: 'md-button md-danger',
        cancelButtonText: 'Закрыть',
        confirmButtonText: 'Да, подписать!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.$store
            .dispatch('GET_USER_PIN')
            .then(
              (response) => {
                if (response.request.status === 200) {
                  Swal.fire({
                    title: 'Введите Пин код!',
                    html:
                      `<div><h4>` +
                      response.data.message +
                      `</h4></div><div class="md-field md-theme-default"> 
                       <input type="number" required id="md-input" class="md-input"></div>`,
                    preConfirm: () => {
                      return [document.getElementById('md-input').value]
                    },
                    showCancelButton: true,
                    confirmButtonClass: 'md-button md-success',
                    cancelButtonClass: 'md-button md-danger',
                    cancelButtonText: 'Закрыть',
                    buttonsStyling: false
                  }).then((result) => {
                    if (result.value[0]) {
                      let pin = result.value[0]
                      this.$store
                        .dispatch('SIGN_REPORT', {id, pin, order})
                        .then((response) => {
                          if (response.request.status === 200) {
                            Swal.fire({
                              title: `Документ успешно подписан!`,
                              type: 'success',
                              buttonsStyling: false,
                              confirmButtonClass: 'md-button md-success'
                            })
                            this.$store
                              .dispatch('GET_REPORT_LIST')
                              .then((response) => {
                                this.tableData = response
                              })
                          } else if (response.request.status === 403) {
                            Swal.fire({
                              text:
                                'Произошла ошибка на сервере! Попробуйте еще раз!',
                              buttonsStyling: false,
                              confirmButtonClass: 'md-button md-success'
                            })
                          } else {
                            Swal.fire({
                              text: response.data.message,
                              buttonsStyling: false,
                              confirmButtonClass: 'md-button md-success'
                            })
                          }
                        })
                    } else {
                    }
                  })
                } else {
                  Swal.fire({
                    text: response.data.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'md-button md-success'
                  })
                }
              },
              (err) => {
                console.log('aaaaaa-', err)
              }
            )
            .catch((error) => {
              Swal.fire({
                text: response.data.message,
                buttonsStyling: false,
                confirmButtonClass: 'md-button md-success'
              })
            })
        }
      })
    },
    checkSignHandler(id, order) {
      this.$store.dispatch('CHECK_SIGN_REPORT', {id, order}).then((res) => {
        if (res.data.message.errorCode) {
          Swal.fire({
            text: res.data.message.errorMessage,
            buttonsStyling: false,
            confirmButtonClass: 'md-button md-success'
          })
        } else {
          let date = new Date(res.data.message.timestamp)
          let strData =
            date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes() +
            ':' +
            date.getSeconds()
          Swal.fire({
            html:
              `<style>
                .mytable {
                  border:0.5px dotted grey;
                  border-collapse: collapse;
                }
                td{
                 text-align: left;
                  max-width : 100px; 
                  text-overflow: ellipsis;
                }
                </style>
                <div>
                <h3>Подпись</h3>
                <table width=100% class="mytable">
                <tr class="mytable"><td class="mytable">ИНН физ.лица</td><td class="mytable">` +
              res.data.message.personIdnp +
              `</td></tr>
                <tr class="mytable"><td>Ф.И.О юр.лица</td><td class="mytable">` +
              res.data.message.personFio +
              `</td></tr>
                <tr class="mytable"><td>ИНН организации</td><td class="mytable">` +
              res.data.message.organizationInn +
              `</td></tr>
                <tr class="mytable"><td  class="mytable">Название оргранизации</td><td class="mytable">` +
              res.data.message.organizationName +
              `</td></tr>
                <tr class="mytable"><td class="mytable">Сертификат</td><td class="mytable">` +
              res.data.message.certName +
              `</td></tr>
                <tr class="mytable"><td>Дата</td><td class="mytable">` +
              strData +
              `</td></tr>
               <tr class="mytable"><td>Подпись</td><td class="mytable">подтверждена</td></tr>
                </table></div>`,
            buttonsStyling: false,
            confirmButtonClass: 'md-button md-success'
          })
        }
        console.log(res)
      })
    },

    sendHandler(id, type) {
      Swal.fire({
        title: '',
        text: `Вы уверены, что хотите отправить документ на подтверждение?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'md-button md-success',
        cancelButtonClass: 'md-button md-danger',
        cancelButtonText: 'Закрыть',
        confirmButtonText: 'Да, отправить!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          if (this.$store.dispatch('SEND_REPORT_TO_ADMIN', {id, type})) {
            Swal.fire({
              title: 'Отправлен!',
              text: 'Ваш документ был  успешно отправлен на подтверждение!',
              type: 'success',
              confirmButtonClass: 'md-button md-success',
              buttonsStyling: false
            }).then(() => {
              this.$store.dispatch('GET_REPORT_LIST').then((response) => {
                this.tableData = response
              })
            })
          }
        }
      })
    },
    async confirmHandler(
      id,
      sender,
      typedoc,
      doc,
      companyName,
      kvartal,
      datesend
    ) {
      Swal.fire({
        title: '',
        text: `Вы уверены, что хотите подтвердить документ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'md-button md-success',
        cancelButtonClass: 'md-button md-danger',
        cancelButtonText: 'Закрыть',
        confirmButtonText: 'Да, подтвердить!',
        buttonsStyling: false
      })
        // .then((result)=>{
        //   if(result){
        //      this.store.dispatch('GET_REPORT_RECEIPT', {
        //       id,
        //       sender,
        //       companyName,
        //       typedoc,
        //       kvartal,
        //       datesend
        //     }).then(id_doc=>{

        //     })
        //     .catch(error => {
        //             console.log(error)
        //         })

        //   }
        // })

        .then((result) => {
          if (result) {
            this.$store.dispatch('GET_REPORT_RECEIPT', {
                id,
                sender,
                companyName,
                typedoc,
                kvartal,
                datesend
              })
              .then((id_doc) => {
                this.$store.dispatch('GET_USER_PIN')
                  .then(
                    (response) => {
                      if (response.request.status === 200) {
                        Swal.fire({
                          title: 'Введите Пин код!',
                          html:
                            `<div><h4>` +
                            response.data.message +
                            `</h4></div><div class="md-field md-theme-default"> 
                       <input type="number" required id="md-input" class="md-input"></div>`,
                          preConfirm: () => {
                            return [document.getElementById('md-input').value]
                          },
                          showCancelButton: true,
                          confirmButtonClass: 'md-button md-success',
                          cancelButtonClass: 'md-button md-danger',
                          cancelButtonText: 'Закрыть',
                          buttonsStyling: false
                        }).then((result) => {
                          if (result.value[0]) {
                            let pin = result.value[0]
                            this.$store
                              .dispatch('SIGN_REPORT', {id_doc, pin, order})
                              .then((response) => {
                                if (response.request.status === 200) {
                                  Swal.fire({
                                    title: `Документ успешно подписан!`,
                                    type: 'success',
                                    buttonsStyling: false,
                                    confirmButtonClass: 'md-button md-success'
                                  })
                                  this.$store
                                    .dispatch('GET_REPORT_LIST')
                                    .then((response) => {
                                      this.tableData = response
                                    })
                                } else if (response.request.status === 403) {
                                  Swal.fire({
                                    text:
                                      'Произошла ошибка на сервере! Попробуйте еще раз!',
                                    buttonsStyling: false,
                                    confirmButtonClass: 'md-button md-success'
                                  })
                                } else {
                                  Swal.fire({
                                    text: response.data.message,
                                    buttonsStyling: false,
                                    confirmButtonClass: 'md-button md-success'
                                  })
                                }
                              })
                          } else {
                          }
                        })
                      } else {
                        Swal.fire({
                          text: response.data.message,
                          buttonsStyling: false,
                          confirmButtonClass: 'md-button md-success'
                        })
                      }
                    },
                    (err) => {
                      console.log(err)
                    }
                  )
                  .catch((response) => {
                    Swal.fire({
                      text: response.data.message,
                      buttonsStyling: false,
                      confirmButtonClass: 'md-button md-success'
                    })
                  })
              })
          }
        })
      //  valid part

      // Swal.fire({
      //   title: '',
      //   text: `Вы уверены, что хотите подтвердить документ?`,
      //   type: 'warning',
      //   showCancelButton: true,
      //   confirmButtonClass: 'md-button md-success',
      //   cancelButtonClass: 'md-button md-danger',
      //   cancelButtonText: 'Закрыть',
      //   confirmButtonText: 'Да, подтвердить!',
      //   buttonsStyling: false
      // }).then((result) => {
      //   this.$store
      //     .dispatch('GET_REPORT_RECEIPT', {
      //       id,
      //       sender,
      //       companyName,
      //       typedoc,
      //       kvartal,
      //       datesend
      //     })
      //     .then((id) => {
      //       this.$store
      //         .dispatch('GET_USER_PIN')
      //         .then(
      //           (response) => {
      //             if (response.request.status === 200) {
      //               Swal.fire({
      //                 title: 'Введите Пин код!',
      //                 html:
      //                   `<div><h4>` +
      //                   response.data.message +
      //                   `</h4></div><div class="md-field md-theme-default">
      //                  <input type="number" required id="md-input" class="md-input"></div>`,
      //                 preConfirm: () => {
      //                   return [document.getElementById('md-input').value]
      //                 },
      //                 showCancelButton: true,
      //                 confirmButtonClass: 'md-button md-success',
      //                 cancelButtonClass: 'md-button md-danger',
      //                 cancelButtonText: 'Закрыть',
      //                 buttonsStyling: false
      //               }).then((result) => {
      //                 console.log(result)
      //                 if (result.value[0]) {

      //                   let pin = result.value[0]
      //                   let order = 1
      //                   this.$store
      //                     .dispatch('SIGN_REPORT', {id, pin, order})
      //                     .then((response) => {
      //                       console.log(response)
      //                       if (response.request.status === 200) {
      //                         // *******************************************************
      //                         this.$store
      //                           .dispatch('CONFIRM_REPORT')
      //                           .then((response) => {
      //                             this.tableData = response
      //                           })
      //                         Swal.fire({
      //                           title: `Документ успешно подписан!`,
      //                           type: 'success',
      //                           buttonsStyling: false,
      //                           confirmButtonClass: 'md-button md-success'
      //                         })
      //                         this.$store
      //                           .dispatch('GET_REPORT_LIST')
      //                           .then((response) => {
      //                             this.tableData = response
      //                           })
      //                       } else if (response.request.status === 403) {
      //                         Swal.fire({
      //                           text:
      //                             'Произошла ошибка на сервере! Попробуйте еще раз!',
      //                           buttonsStyling: false,
      //                           confirmButtonClass: 'md-button md-success'
      //                         })
      //                       } else {
      //                         console.log(response)
      //                         Swal.fire({
      //                           text: response,
      //                           buttonsStyling: false,
      //                           confirmButtonClass: 'md-button md-success'
      //                         })
      //                       }
      //                     })
      //                 } else {
      //                 }
      //               })
      //             } else {
      //               Swal.fire({
      //                 text: response.data.message,
      //                 buttonsStyling: false,
      //                 confirmButtonClass: 'md-button md-success'
      //               })
      //             }
      //           },
      //           (err) => {
      //             console.log(err)
      //           }
      //         )
      //         .catch((error) => {
      //           Swal.fire({
      //             text: response.data.message,
      //             buttonsStyling: false,
      //             confirmButtonClass: 'md-button md-success'
      //           })
      //         }),
      //         (err) => {
      //           Swal.fire({
      //             text: 'Произошла ошибка на сервере! Попробуйте еще раз!',
      //             buttonsStyling: false,
      //             confirmButtonClass: 'md-button md-success'
      //           })
      //         }

      //       if (result.value) {
      //         if (
      //           this.$store.dispatch('GET_REPORT_RECEIPT', {
      //             id,
      //             sender,
      //             companyName,
      //             typedoc,
      //             kvartal,
      //             datesend
      //           })
      //         ) {
      //           if (typedoc.includes('Существенный')) {
      //             let newDoc = []
      //             let fact = {}
      //             let titles = {}
      //             let j = 0
      //             for (let i = 0; i < doc.fields.length; i++) {
      //               if (
      //                 doc.fields[i].element === 'label' ||
      //                 doc.fields[i].element === 'h6'
      //               ) {
      //                 titles['title' + [j]] = {
      //                   text: doc.fields[i].name,
      //                   type: 'header'
      //                 }
      //                 j++
      //               } else if (
      //                 doc.fields[i].element === 'input' ||
      //                 doc.fields[i].element === 'input-text-area'
      //               ) {
      //                 newDoc.push(doc.fields[i].value)
      //                 if (doc.fields[i].name) {
      //                   titles['title' + [j]] = doc.fields[i].name
      //                   j++
      //                 } else {
      //                   titles['title' + [j - 1]] = doc.fields[i - 1].name
      //                 }
      //               }
      //             }
      //             fact['titles'] = titles
      //             let name = companyName + ' : ' + doc.title
      //             let doAddEntry = 'test'
      //             let BlogId = '3'

      //           //  this.sendToKSE(name, newDoc, companyName, fact)

      //             // this.sendToKSE(name, newDoc, companyName, fact)
      //             // .then(
      //             //   (response) => {
      //             //     let link = response.data
      //             //     let idfact = id.toString()
      //             //     if (
      //             //       this.$store.dispatch('ADD_LINK_TO_KSE', {
      //             //         idfact,
      //             //         link
      //             //       })
      //             //     ) {
      //             //       Swal.fire({
      //             //         title: 'Потвержден!',
      //             //         text: 'Вы успешно потвердили документ !',
      //             //         type: 'success',
      //             //         confirmButtonClass: 'md-button md-success',
      //             //         buttonsStyling: false
      //             //       }).then(() => {
      //             //         this.$store
      //             //           .dispatch('GET_REPORT_LIST')
      //             //           .then((response) => {
      //             //             this.tableData = response
      //             //           })
      //             //       })
      //             //     }
      //             //   }
      //             // )
      //           } else {
      //             let company_name = companyName
      //             this.$store
      //               .dispatch('SEND_REPORTS_TO_KSE', {
      //                 kvartal,
      //                 doc,
      //                 company_name
      //               })
      //               .then((response) => {
      //                 let link = response.data
      //                 let idfact = id.toString()
      //                 if (
      //                   this.$store.dispatch('ADD_LINK_TO_KSE', {
      //                     idfact,
      //                     link
      //                   })
      //                 ) {
      //                   Swal.fire({
      //                     title: 'Потвержден!',
      //                     text: 'Вы успешно потвердили документ !',
      //                     type: 'success',
      //                     confirmButtonClass: 'md-button md-success',
      //                     buttonsStyling: false
      //                   }).then(() => {
      //                     this.$store
      //                       .dispatch('GET_REPORT_LIST')
      //                       .then((response) => {
      //                         this.tableData = response
      //                       })
      //                   })
      //                 }
      //               })
      //           }
      //         }
      //       }
      //     })
      // })
    },
    sendToKSE(mEntryName, mEntryText, mEntryCompany, titles) {
      let doAddEntry = 'test'
      let BlogId = '3'
      return this.$store.dispatch('SEND_NEWS_TO_KSE', {
        doAddEntry,
        BlogId,
        mEntryText,
        mEntryName,
        mEntryCompany,
        titles
      })
    },
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort
        if (this.currentSortOrder === 'asc') {
          return a[sortBy].localeCompare(b[sortBy])
        }
        return b[sortBy].localeCompare(a[sortBy])
      })
    },
    getDate(date) {
      // Форматирование даты в формат d.m.Y
      if (date != undefined) {
        var options = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        }
        let newDate = new Date(date)
        return newDate.toLocaleString('ru', options)
      }
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return 'Редактирование'

        case 2:
          return 'Отправлен'

        case 3:
          return 'Принят'

        case 4:
          return 'Отклонен'

        case 5:
          return 'Подписан первой ЭЦП'

        case 6:
          return 'Подписан второй ЭЦП'
      }
    },
    revokeHandler(id) {
      Swal.fire({
        title: '',
        text: `Вы действительно хотите отменить отправку?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'md-button md-success',
        cancelButtonClass: 'md-button md-danger',
        cancelButtonText: 'Закрыть',
        confirmButtonText: 'Да, отменить!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          if (this.$store.dispatch('REVOKE_REPORT', id)) {
            Swal.fire({
              title: 'Отправка отменена!',
              text: 'Ваш документ готов к редактированию!',
              type: 'success',
              confirmButtonClass: 'md-button md-success',
              buttonsStyling: false
            }).then(() => {
              this.$store.dispatch('GET_REPORT_LIST').then((response) => {
                this.tableData = response
              })
            })
          }
        }
      })
    },
    rejectHandler(id) {
      Swal.fire({
        title: '',
        text: `Вы действительно хотите отклонить?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'md-button md-success',
        cancelButtonClass: 'md-button md-danger',
        cancelButtonText: 'Закрыть',
        confirmButtonText: 'Да, отклонить!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          if (this.$store.dispatch('REJECT_REPORT', id)) {
            this.tableData = ''
            Swal.fire({
              title: 'Отклонен!',
              text: '',
              type: 'success',
              confirmButtonClass: 'md-button md-success',
              buttonsStyling: false
            }).then(() => {
              this.$store.dispatch('GET_REPORT_LIST').then((response) => {
                this.tableData = response
              })
            })
          }
        }
      })
    },
    toCartHandler(id) {
      Swal.fire({
        title: '',
        text: `Вы уверены, что хотите переместить документ в корзину ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'md-button md-success',
        cancelButtonClass: 'md-button md-danger',
        cancelButtonText: 'Закрыть',
        confirmButtonText: 'Да, переместить!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          if (this.$store.dispatch('MOVE_TO_CART_REPORT', id)) {
            let index = this.tableData.findIndex((el) => el.id === id)
            this.tableData.splice(index, 1)
            Swal.fire({
              title: 'Перемещен!',
              text: '',
              type: 'success',
              confirmButtonClass: 'md-button md-success',
              buttonsStyling: false
            })
          }
        }
      })
    }
  },
  async mounted() {
    this.tableData = await this.$store.dispatch('GET_REPORT_LIST')
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ['typedoc', 'name'],
      threshold: 0.3
    })
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    searchQuery(value) {
      let result = this.tableData
      if (value !== '') {
        result = this.fuseSearch.search(this.searchQuery)
      }
      this.searchedData = result
    }
  }
}
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
.custom-select-button {
  height: 2rem;
}
.custom-md-group {
  width: 13rem;
}
.custom-edit-button {
  vertical-align: top;
  white-space: normal;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  width: 7rem;
  height: 3rem;
  line-height: 1rem;
  font-size: 0.775rem;
  display: inline-block;
  align-items: center;
  justify-content: center;
  top: 0px;
}

.clip {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
</style>
