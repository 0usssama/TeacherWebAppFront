<template>
  <div>
    <v-navigation-drawer v-model="returnedTest" app>
      <!--  -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in NavItems"
          :key="item.title"
          tag="router-link"
          :to="item.route"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["returnedTest"],
  computed: {
    ...mapState(["NavItems"]),
  },
  data() {
    return {
      right: null,
    };
  },
};
</script>

<style></style>
