<template>
  <ul class="nav nav-mobile-menu">
    <li v-if="isLoggedIn" @click="logout">
      <router-link to="#">
        <i class="material-icons">logout</i>
        <p>Выйти</p>
      </router-link>
    </li>
    <li>
      <router-link to="/Home">
        <i class="material-icons">home</i>
        <p>Главная</p>
      </router-link>
    </li>
  </ul>
</template>
<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState({isLoggedIn: (state) => state.token !== ''})
  },

  data() {
    return {}
  },
  methods: {
    logout() {
      this.$store.dispatch('LOGOUT').then(() => {
        this.$router.push('/auth/login')
      })
    }
  }
}
</script>
