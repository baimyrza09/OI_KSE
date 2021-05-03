<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>manage_accounts</md-icon>
          </div>
          <h4 class="title">Пользователи</h4>
        </md-card-header>
        <md-card-content>
          <md-table
            :value="queriedData"
            :md-sort.sync="currentSort"
            :md-sort-order.sync="currentSortOrder"
            class="paginated-table table-striped table-hover"
          >
            <md-table-toolbar>
              <md-field>
                <label for="pages">Данные на странице</label>
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

              <md-button class="md-raised md-success"
               @click="showModal()"
                ><span class="material-icons">
                  person_add_alt_1
                </span></md-button>

              <md-field>
                <md-input
                  type="search"
                  class="mb-3"
                  clearable
                  style="width: 200px"
                  placeholder="Поиск"
                  v-model="searchQuery"
                ></md-input>
              </md-field>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{item}">
              <md-table-cell md-label="Логин" md-sort-by="login">
                {{ item.login }}
              </md-table-cell>
              <md-table-cell md-label="Компания">
                {{ item.name }}
              </md-table-cell>

              <md-table-cell>
                <md-button
                  class="md-icon-button md-dense md-raised md-success"
                  @click="getConfirm(item.id)"
                >
                  <md-icon>restart_alt</md-icon>
                  <md-tooltip md-direction="left">Сбросить пароль</md-tooltip>
                </md-button>
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
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">
                        {{ item }}
                      </div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
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
        </md-card-content>
      </md-card>
    </div>

    <md-snackbar
      md-position="center"
      :md-active="getShowSnackbar"
      md-persistent
    >
      <span>Пароль пользователя изменен на 123</span>
    </md-snackbar>

    <md-dialog :md-active.sync="active">
      <md-dialog-title>Вы уверены что хотите сбросить пароль ?</md-dialog-title>
      <md-dialog-actions>
        <md-button class="md-danger" @click="active = false">Нет</md-button>
        <md-button class="md-success" @click="getUserId">Да</md-button>
      </md-dialog-actions>
    </md-dialog>

    <manage-accounts-add-company></manage-accounts-add-company>

  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Buttons from '../Components/Buttons.vue'
import {Pagination} from '@/components'
import Fuse from 'fuse.js'
import ManageAccountsAddCompany from '../Components/ManageAccountsAddCompany'
export default {
  components: {Buttons, Pagination, ManageAccountsAddCompany},

  data() {
    return {
      currentSort: 'title',
      currentSortOrder: 'asc',
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      footerTable: ['Название документа', ''],
      searchQuery: '',
      propsToSearch: ['title'],
      tableData: this.getAllUsersList || [],
      searchedData: [],
      fuseSearch: null,
      active: false,
      value: null,
      selectedId: null
    }
  },
  methods: {
    ...mapActions(['getUserList', 'resetUser', 'showModalMAAC']),
    getUser() {
      this.getUserList(this.login)
    },
    getUserId() {
      this.active = false
      this.resetUser(this.selectedId)
    },
    getConfirm(id) {
      this.active = true
      this.selectedId = id
    },
    showModal(){
      this.showModalMAAC()
    }
  },
  computed: {
    ...mapGetters(['getAllUsersList', 'getShowSnackbar']),

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
  async mounted() {
    await this.getUserList()
    this.tableData = await this.getAllUsersList
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ['login', 'name'],
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
  width: 5rem;
  height: 2rem;
}
</style>