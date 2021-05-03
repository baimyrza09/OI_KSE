<template>
  <div class="md-layout text-center">
    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
    >
      <login-card header-color="green">
        <md-button slot="title" class="md-simple md-white">
          <img src="/kse-icon.png" />
        </md-button>
        //locale
        <!-- <div class="md-group" slot="buttons">
          <md-button
            @click="setLocale('ru')"
            class="md-just-icon md-simple md-white"
          >
            RU
          </md-button>
          <md-button
            @click="setLocale('kg')"
            class="md-just-icon md-simple md-white"
          >
            KG
          </md-button>
        </div> -->
        <p slot="description" class="description">Авторизация</p>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>account_circle</md-icon>
          <label>Логин</label>
          <md-input v-model="username"></md-input>
        </md-field>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>lock_outline</md-icon>
          <label>Пароль</label>
          <md-input
            v-model="password"
            type="password"
            v-on:keyup.enter="onEnter"
          ></md-input>
        </md-field>
        <p class="request" slot="inputs" v-if="isHidden">
          {{ request }}
        </p>
        <md-button
          slot="footer"
          class="md-simple md-success md-lg"
          @click="handleLogin"
          onkeypress="clickPress(event)"
        >
          {{ $t('loginButton') }}
        </md-button>
      </login-card>
    </div>
  </div>
</template>
<script>
import {LoginCard} from '@/components'
import Swal from 'sweetalert2'
export default {
  components: {
    LoginCard
  },
  data() {
    return {
      isHidden: false,
      request: 'Произошла ошибка при авторизации! Неверное имя или пароль!',
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      let login = this.username
      let password = this.password
      this.$store
        .dispatch('LOGIN', {login, password})
        .then((resp) => {
          if (resp === true) {
            this.$router.push('/home')
            Swal.fire({
              html:'<div><h5>Уважаемые пользователи Open Information System. ЗАО "Кыргызская фондовая биржа" информирует Вас о том, что с 1 июня 2021г. прием и отправка информации будет производится с использованием облачной электронно-цифровой подписи (ЭЦП).В соответствии с Законом Кыргызской Республики «О цифровой подписи» электронная подпись выступает полноценной заменой рукописной подписи, и имеет полную юридическую силу. Информация в электронной форме, подписанная электронной подписью, признается электронным документом, равнозначным документу на бумажном носителе, подписанному собственноручной подписью.Выдача облачных ЭЦП осуществляется в Центрах обслуживания населения (ЦОН), список документов для получения облачной ЭЦП для юридического лица Вы можете найти по ссылке:</h5><a href="https://infocom.kg/ru/pki/entity/" target="_blank">https://infocom.kg/ru/pki/entity/</a></div>',
              // text:
              //   'https://infocom.kg/ru/pki/entity/',
              
              showCancelButton: false,
              cancelButtonClass: 'md-button md-success',
              cancelButtonText: 'Закрыть',
            })
          } else {
            this.isHidden = true
          }
        })
        .catch((err) => console.log(err))
    },
    setLocale(locale) {
      this.$i18n.locale = locale
    },
    onEnter(event) {
      this.handleLogin()
    }
  }
}
</script>

<style>
.request {
  color: darkred;
  margin-bottom: -25px;
}
</style>
