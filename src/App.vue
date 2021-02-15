<template>
  <div>
    <transition name="fade">
      <div v-if="tokenExists() || auth.token !== null">
        <v-app>
          <Navbar />

          <v-app-bar app>
            <v-app-bar-nav-icon @click="drawerSwitch"></v-app-bar-nav-icon>
            <v-toolbar-title>Teacherapp</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="logMeOut" icon>
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-app-bar>
          <v-main>
            <div class="py-5 px-5">
              <router-view></router-view>
            </div>
          </v-main>
        </v-app>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="!tokenExists() || auth.token == null">
        <Login />
      </div>
    </transition>
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
<script>
import Navbar from '@/components/Navbar.vue'
import Login from '@/views/Login.vue'
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState(['authenticated', 'auth', 'drawerState'])
  },
  components: {
    Navbar,
    Login
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions({
      logMeOut: 'auth/logout',
      drawerSwitch: 'drawerSwitch'
    }),

    tokenExists() {
      const userToken = localStorage.getItem('user') // grab user data from local storage
      return userToken !== '' && userToken !== null ? true : false
    }
  }
}
</script>
