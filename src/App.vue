<template>
  <v-app id="inspire">
    <Navbar :returnedTest="test" />

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
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      test: true,
    };
  },
  methods: {
    switchDrawer() {
      this.test = !this.test;
    },
  },
};
</script>
