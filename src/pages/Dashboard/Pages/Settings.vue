<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-lg-size-100 md-size-100">
        <user-pass-edit header-color="green"></user-pass-edit>
      </div>
      <!-- <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card button-color="success"> </user-card>
      </div> -->
    </div>
  </div>
</template>

<script>
// import { EditProfileForm, UserCard } from "@/pages";

import UserPassEdit from './UserPassEdit.vue'

export default {
  components: {
    UserPassEdit
  
    // UserCard
  }
}
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
