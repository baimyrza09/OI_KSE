<template>
  <div class="md-layout text-center">
    <div class="md-layout-item md-size-100 md-lg-size-100">
      <h1 style="padding-top: 12%">404</h1>
      <h4>Страница не найдена</h4>
      <h6>Запрашиваемая страничка не найдена, либо произошла ошибка!</h6>
      <router-link to="/Home">
        <p>Перейти на главную страничку</p>
      </router-link>
    </div>
  </div>
</template>
<script>
import {LockCard} from '@/components'
export default {
  components: {
    LockCard
  },
  data() {
    return {
      password: null,
      image: './img/faces/avatar.jpg'
    }
  }
}
</script>
<style></style>
