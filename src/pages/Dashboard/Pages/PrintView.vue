<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-size-100 item-back md-padding">
        <div class="md-group">
          <md-button @click="backToListHandler">
            <span class="md-label">
              <md-icon class="material-icons">keyboard_arrow_left</md-icon>
            </span>
            Назад
          </md-button>
          <md-button class="md-info" @click="printHandler()">
            Печать
          </md-button>
        </div>
      </div>
      <div
        id="printMe"
        class="md-layout-item md-size-100 md-padding"
        v-if="!isDataLoading"
      >
        <md-card>
          <md-card-header class="md-card-header-text md-card-header-green">
            <div class="card-text">
              <h4
                v-if="
                  !(doc.title == 'Квитанция' || doc.title == 'Приложение 2-1')
                "
                class="title"
              >
                {{ doc.title }}
              </h4>
            </div>
          </md-card-header>
          <md-card-content>
            <template v-if="doc.title == 'Квитанция'">
              <div v-for="(field, key) in doc.fields" v-bind:key="key">
                <!-- инпут  -->
                <template v-if="field.element === 'input'">
                  <div class="md-layout md-size-100 custom-md">
                    <template v-if="field.name">
                      <div style="padding-left: 50px; font-size: 14pt">
                        <label>{{ field.name }} : {{ field.value }}</label>
                      </div>
                    </template>
                    <template v-else>
                      <label style="padding-left: 50px; font-size: 14pt">
                        {{ field.value }}</label
                      >
                    </template>
                  </div>
                </template>
                <!-- /инпут  -->

                <template v-if="field.element === 'img'">
                  <img
                    v-bind:src="'.' + field.name"
                    style="
                      width: 100%;
                      text-align: center;
                      padding: 15px 15px 80px 0px;
                    "
                  />
                </template>
                <template v-if="field.element === 'stump'">
                  <img
                    v-bind:src="'.' + field.name"
                    class="stump"
                    style="
                      width: 40%;
                      float: right;
                      margin: 1%;
                      padding-top: 200px;
                    "
                  />
                </template>
              </div>
            </template>
            <template v-else>
              <!-- парсинг структуры документа -->
              <div v-for="(field, key) in doc.fields" v-bind:key="key">
                <!-- заголовок -->
                <template v-if="field.element === 'header'">
                  <h5 style="width: 30%; float: right; margin: auto 0">
                    {{ doc.title }}
                  </h5>
                  <br />
                  <p style="width: 30%; float: right">{{ field.name }}</p>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </template>
                <!-- /заголовок -->
                <!-- селектор -->
                <template
                  v-if="
                    field.element === 'select' &&
                    (!field.id == 'select_quarter' ||
                      !field.id == 'select_report_date')
                  "
                >
                  <div class="md-layout custom-md md-size-30">
                    <label>{{ field.name }} : {{ field.value }} </label>
                  </div>
                </template>
                <template
                  v-else-if="
                    field.element === 'select' && field.id == 'select_quarter'
                  "
                  ><h5>
                    {{ doc.fields[key].value }} {{ doc.fields[key + 1].value }}
                  </h5></template
                >

                <!-- /селектор -->
                <!-- строки -->
                <template v-if="field.element === 'h1'">
                  <h1>{{ field.name }}</h1>
                </template>
                <template v-if="field.element === 'h2'">
                  <h2>{{ field.name }}</h2>
                </template>
                <template v-if="field.element === 'h3'">
                  <h3>{{ field.name }}</h3>
                </template>
                <template v-if="field.element === 'h4'">
                  <h4>{{ field.name }}</h4>
                </template>
                <template v-if="field.element === 'h5'">
                  <h5>{{ field.name }}</h5>
                </template>
                <template v-if="field.element === 'h6'">
                  <h6>{{ field.name }}</h6>
                </template>
                <template v-if="field.element === 'p'">
                  <p>{{ field.name }}</p>
                </template>
                <template v-if="field.element === 'span'">
                  <span>{{ field.name }}</span>
                </template>
                <!-- /строки -->
                <!-- инпут  -->
                <template v-if="field.element === 'input'">
                  <div class="md-layout md-size-100 custom-md">
                    <template v-if="field.name">
                      <label>{{ field.name }} : {{ field.value }}</label>
                    </template>
                    <template v-else>
                      <label> {{ field.value }}</label>
                    </template>
                  </div>
                </template>
                <!-- /инпут  -->
                <!-- textarea   -->
                <template v-if="field.element === 'input-text-area'">
                  <div class="md-layout md-size-100 custom-md">
                    <template v-if="field.name">
                      <label>{{ field.name }} : {{ field.value }}</label>
                    </template>
                    <template v-else>
                      <label>{{ field.value }}</label>
                    </template>
                  </div>
                </template>
                <!-- /textarea -->
                <!-- групровые инпуты -->
                <template v-if="field.element === 'group'">
                  <div>
                    <!-- <h4>{{ field.name }}</h4> -->
                    <div
                      v-for="(item, key) in field.items"
                      v-bind:key="key"
                      class="md-layout-item md-size-100"
                    >
                      <label>{{ item.name }} : {{ item.value }}</label>
                    </div>
                  </div>
                </template>
                <!-- /групровые инпуты -->
                <!-- таблицы -->
                <template v-if="field.element === 'table'">
                  <h6 v-if="field.name != ''">{{ field.name }}</h6>
                  <md-table style="border-spacing: 0px" class="md-layout">
                    <md-table-row slot="md-table-header">
                      <template v-for="header in field.headers">
                        <template v-if="header != '*'">
                          <md-table-cell
                            style="border: 1px solid lightgrey"
                            :key="header"
                          >
                            {{ header }}
                          </md-table-cell>
                        </template>

                        <template v-else>
                          <md-table-cell
                            style="border-left: hidden"
                            :key="header"
                          >
                          </md-table-cell>
                        </template>
                      </template>
                    </md-table-row>

                    <md-table-row
                      slot="md-table-row"
                      v-for="(row, key) in field.rows"
                      v-bind:key="key"
                    >
                      <md-table-cell
                        v-for="(cell, key) in row.cells"
                        :key="key"
                        style="
                          border: 1px solid lightgrey;

                          border-spacing: 0px;
                        "
                      >
                        <template v-if="cell.element === 'input'">
                          {{ cell.value }}
                          <!-- <md-field>
                        <md-input disabled type="text" v-model="cell.value"></md-input> 
                        </md-field> -->
                        </template>
                        <template v-else-if="cell.element === 'label-input'">
                          <label class="md-label"
                            >{{ cell.name }} {{ cell.value }}</label
                          >
                        </template>

                        <template v-else>
                          {{ cell.name }}
                        </template>
                      </md-table-cell>
                    </md-table-row>
                  </md-table>
                </template>

                <!-- /таблицы -->
                <!-- изображение -->
                <template v-if="field.element === 'img'">
                  <img
                    v-bind:src="field.name"
                    style="
                      width: 100%;
                      text-align: center;
                      padding: 15px 15px 30px 0px;
                    "
                  />
                </template>

                <!-- /изображение -->
                <!-- /парсинг структуры документа -->
              </div>
            </template>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async created() {
    let searchedDoc = this.$route.params.id
    this.report = Object.assign(
      {},
      await this.$store.dispatch('GET_REPORT_BY_ID', searchedDoc)
    )
    this.doc = this.report.doc
    this.isDataLoading = false
  },
  components: {
    // Modal
  },
  mounted() {},

  data() {
    return {
      classicModal: false,
      isDataLoading: true,
      report: {},
      doc: {},
      output: null
    }
  },
  methods: {
    classicModalHide: function () {
      this.classicModal = false
    },
    backToListHandler: function () {
      this.$router.push({path: `/reports`})
    },
    printHandler: function () {
      const localOptions = {
        styles: ['../mycss.css']
      }
      this.$htmlToPaper('printMe', localOptions)
    }
  }
}
</script>
<style lang="scss" scoped>
.md-card .md-card-actions {
  border: none;
}

.md-inline-checkboxes {
  display: inline-flex;

  .md-checkbox {
    margin-top: 15px !important;
  }
}
.md-button {
  @media print {
    display: none;
  }
}
.md-checkbox,
.md-radio {
  margin-top: 15px;
  margin-bottom: 0.5rem;
}

.md-checkbox,
.md-radio {
  display: flex;
}

.md-radio + .md-radio-container {
  margin-left: 5px;
  position: relative;
  left: -3px;
}

.md-form-label + .md-layout-item .md-checkbox:not(:first-child),
.md-form-label + .md-layout-item + .md-layout-item .md-radio:not(:first-child),
.md-form-label + .md-layout-item .md-radio {
  margin-top: 0;
}

.form-control-static {
  margin-top: 6px;
}
.item-back {
  text-align: right;
}
.text-center {
  justify-content: center !important;
}
// .md-padding{

//   padding:0px 30px 0px 30px;

// }
.label-custom {
  margin-bottom: none;
  padding-bottom: none;
  color: lightslategray;
  font-style: bold;
}
.img {
  width: 50%;
}
.stump {
  width: 20%;
  float: right;
  margin: 1%;
}

.md-just-icon {
  float: right;
}
.input-custom {
  margin-left: 1rem;
}
.custom-md {
  margin-bottom: 0.5rem;
}

.title {
  @media print {
    color: black;
  }
}

.md-card-header-text {
  color: black;
}
.print-app {
  display: block;
}

.md-field:after,
:before {
  border-bottom: hide;
}
</style>
