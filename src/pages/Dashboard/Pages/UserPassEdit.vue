<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-warning">
            <div class="card-icon">
              <md-icon>settings</md-icon>
            </div>
            <h4 class="title">Сменить пароль</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field
                  :class="[
                    {'md-valid': !errors.has('password') && touched.password},
                    {'md-error': errors.has('password')}
                  ]"
                >
                  <label>Новый пароль</label>
                  <md-input
                    v-model="password"
                    data-vv-name="password"
                    type="password"
                    ref="password"
                    required
                    v-validate="modelValidations.password"
                  ></md-input>
                  <slide-y-down-transition>
                    <md-icon class="error" v-show="errors.has('password')">
                      close
                    </md-icon>
                  </slide-y-down-transition>
                  <slide-y-down-transition>
                    <md-icon
                      class="success"
                      v-show="!errors.has('password') && touched.password"
                    >
                      done
                    </md-icon>
                  </slide-y-down-transition>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field
                  :class="[
                    {
                      'md-valid':
                        !errors.has('confirmPassword') && touched.confirmPass
                    },
                    {'md-error': errors.has('confirmPassword')}
                  ]"
                >
                  <label>Подтверждение пароля</label>
                  <md-input
                    v-model="confirmPassword"
                    data-vv-name="confirmPassword"
                    data-vv-as="password"
                    type="password"
                    required
                    v-validate="modelValidations.confirmPassword"
                  ></md-input>
                  <slide-y-down-transition>
                    <md-icon
                      class="error"
                      v-show="errors.has('confirmPassword')"
                    >
                      close
                    </md-icon>
                  </slide-y-down-transition>
                  <slide-y-down-transition>
                    <md-icon
                      class="success"
                      v-show="
                        !errors.has('confirmPassword') &&
                        touched.confirmPassword
                      "
                    >
                      done
                    </md-icon>
                  </slide-y-down-transition>
                </md-field>
              </div>
              <div class="md-layout-item md-size-100 text-right">
                <md-button
                  native-type="submit"
                  @click.native.prevent="validate"
                  class="md-success"
                >
                  Сохранить
                </md-button>
              </div>
              <div
                v-if="isHidden"
                class="md-layout-item md-size-100 text-right request"
              >
                <p>{{ request }}</p>
              </div>
            </div>
          </md-card-content>
        </md-card>
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-warning">
            <div class="card-icon">
              <md-icon>settings</md-icon>
            </div>
            <h4 class="title">ИНН</h4>
          </md-card-header>
          <md-card-content class="pl-5">
            <div class="md-layout">
              <div class="md-layout-item md-size-70 md-small-size-100">
                <md-field v-if="userInn.user_inn">
                  <label>ИНН</label>
                  <md-input v-model="inn" type="password" value="userInn.user_inn"></md-input>
                  <span class="md-helper-text">Введите ИНН</span>
                </md-field>
                <md-field v-else>
                  <label>ИНН</label>
                  <md-input v-model="inn" value="userInn.user_inn"></md-input>
                  <span class="md-helper-text">Введите ИНН</span>
                </md-field>
              </div>
              <div class="md-layout-item md-size-30 md-small-size-100">
                <div class="md-layout-item">
                  <md-radio v-model="inntype" value="2">Юр.Лицо</md-radio>
                  <md-radio v-model="inntype" value="1">Физ.Лицо</md-radio
                  >
                </div>
              </div>
              <div class="md-layout-item md-size-100 text-right">
                <md-button class="md-success" @click="getUserInn">
                  Сохранить
                </md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <snack-bar />
  </div>
</template>
<script>
import {SlideYDownTransition} from 'vue2-transitions'
import {mapGetters} from 'vuex'
import SnackBar from '../../../components/SnackBar/SnackBar'
export default {
  components: {
    SlideYDownTransition,
    SnackBar
  },
  data() {
    return {
      request: 'Пароль обновлен!',
      isHidden: false,
      boolean: null,
      password: '',
      confirmPassword: '',
      touched: {
        password: false,
        confirmPass: false
      },
      modelValidations: {
        password: {
          required: true,
          min: 8
        },
        confirmPassword: {
          required: true,
          confirmed: 'password'
        }
      },
      inn: null,
      inntype: null
    }
  },
  methods: {
    validate() {
      let password = this.password
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.$store
            .dispatch('CHANGE_PASS', password)
            .then(() => {
              this.isHidden = true
            })
            .catch((err) => console.log(err))
        }
      })
    },
    getUserInn() {
      this.$store.dispatch('USER_INN', {
        user_inn: this.inn,
        user_form: this.inntype
      })
    }
  },
  computed: {
    ...mapGetters(['userInn'])
  },
  async mounted() {
    await this.$store.dispatch('GET_USER_INN')
    this.inn = await this.userInn.user_inn
    this.inntype = (await this.userInn.user_form)
      ? await this.userInn.user_form.toString()
      : null
  },
  watch: {
    email() {
      this.touched.email = true
    },
    password() {
      this.touched.password = true
    },
    confirmPassword() {
      this.touched.confirmPass = true
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
.request {
  color: green;
}
.md-success {
  margin-top: 20px;
}
</style>