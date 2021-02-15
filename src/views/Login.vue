<template>
  <v-app>
    <v-card width="800" elevation="17" class="mx-auto my-auto">
      <ValidationObserver ref="obs" v-slot="{ invalid, handleSubmit }">
        <v-card-title>
          <h1 class="display-1">Login</h1>
        </v-card-title>

        <v-card
          v-if="auth.errors != ''"
          class="d-flex justify-center"
          flat
          tile
        >
          <v-alert border="left" elevation="5" outlined type="error">
            {{ auth.errors }}
          </v-alert>
        </v-card>
        <v-card-text>
          <v-form>
            <ValidationProvider
              mode="lazy"
              name="email"
              rules="required|email"
              v-slot="{ errors, valid }"
            >
              <v-text-field
                @focus="clearError"
                :error-messages="errors"
                :success="valid"
                v-model="userCredentials.email"
                prepend-icon="mdi-account-circle"
                label="Email"
              />
            </ValidationProvider>
            <ValidationProvider
              mode="lazy"
              name="password"
              rules="required"
              v-slot="{ errors, valid }"
            >
              <v-text-field
                @focus="clearError"
                :error-messages="errors"
                :success="valid"
                v-model="userCredentials.password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
              />
            </ValidationProvider>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <!--
          <v-btn color="success">Register</v-btn>
          -->
          <v-spacer></v-spacer>
          <v-btn
            color="info"
            :disabled="invalid"
            @click="handleSubmit(initiateLogin)"
            >Login</v-btn
          >
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['authenticated']),
    ...mapState(['auth', 'auth'])
  },
  data() {
    return {
      showPassword: false,
      userCredentials: {
        email: null,
        password: null
      }
    }
  },
  methods: {
    ...mapActions({
      signIn: 'auth/signIn',
      clear: 'auth/clear'
    }),
    clearError() {
      this.clear()
    },

    async initiateLogin() {
      try {
        await this.signIn(this.userCredentials)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style></style>
