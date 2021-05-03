<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <md-card class="md-card-plain">
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>gavel</md-icon>
          </div>
          <h4 class="title mt-0">Нормативные акты</h4>
          <p class="category"></p>
        </md-card-header>
        <md-card-content>
          <md-table v-model="files">
            <md-table-row slot="md-table-row" slot-scope="{item}">
              <md-table-cell md-label="">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="">
                <a :href="item.link" target="_blank">Прочитать</a>
                <!-- <a href="./files/Закон_КР_Об_акционерных_обществах.pdf" target="_blank"> Прочитать </a> -->
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import {} from '@/components'

export default {
  components: {},
  props: {},
  data() {
    return {
      files: [
        {
          name: 'Закон КР О рынке ценных бумаг',
          link: './files/Закон_КР_О_рынке_ценных_бумаг.pdf'
        },
        {
          name: 'Закон КР Об акционерных обществах',
          link: './files/Закон_КР_Об_акционерных_обществах.pdf'
        },
        {
          name:
            'Положение о порядке предоставления отчетности (информации) и раскрытии информации субъектами финансового рынка',
          link:
            './files/Положение_о_порядке_предоставления_отчетности_информации_и_раскрытии.pdf'
        }
      ]
    }
  },
  methods: {},
  mounted() {}
}
</script>

<style lang="css"></style>
