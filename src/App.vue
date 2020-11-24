<template>
  <div>
    <div v-if="authenticated">
      <v-app>
        <Navbar :returnedTest="drawerState" />

        <v-app-bar app>
          <v-app-bar-nav-icon @click="switchDrawer"></v-app-bar-nav-icon>

          <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-main>
          <div class="py-5 px-5">
            <router-view></router-view>
          </div>
        </v-main>
      </v-app>
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Login from "@/views/Login.vue";
export default {
  components: {
    Navbar,
    Login,
  },
  data() {
    return {
      drawerState: true,
      authenticated: false,
    };
  },
  methods: {
    switchDrawer() {
      this.test = !this.test;
    },
  },
};
</script>
