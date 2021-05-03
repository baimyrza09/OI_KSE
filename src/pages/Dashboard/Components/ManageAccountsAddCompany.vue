<template>
  <div>
    <md-dialog :md-active="getShowModal">
      <md-dialog-title>Preferences</md-dialog-title>

      <md-dialog-actions>
        <md-field>
          <label>Логин</label>
          <md-input v-model="login"></md-input>
        </md-field>
      </md-dialog-actions>
      <md-dialog-actions>
           <md-field>
          <label>Название компании</label>
          <md-input v-model="companyName"></md-input>
        </md-field>
      </md-dialog-actions>
       <md-dialog-actions>
           <md-field>
          <label>Код</label>
          <md-input v-model="code"></md-input>
        </md-field>
      </md-dialog-actions>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeModalMAAC">Close</md-button>
        <md-button class="md-primary" @click="addCompany">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  data: () => ({
      login: '',
      companyName: '',
      code: ''
  }),
  methods: {
    ...mapActions(['addNewCompany', 'closeModalMAAC']),
    addCompany() {
        console.log('test')
      this.addNewCompany({company: {name: this.companyName, kod: this.code}, login: this.login})
    }
  },
  computed: {
    ...mapGetters(['getShowModal'])
  }
}
</script>

<style lang="scss" scoped>
.md-dialog + .md-dialog-container {
  max-width: 768px;
}
</style>