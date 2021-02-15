import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2'
import './vee-validate'
import 'sweetalert2/dist/sweetalert2.min.css'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.use(VueSweetalert2)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  async created() {
    const userToken = localStorage.getItem('user') // grab user data from local storage
    if (userToken) {
      // check to see if there is indeed a user
      let attempAuth = this.$store.dispatch('auth/tokenLogin', userToken)
      try {
        await attempAuth.then(() => {})
      } catch (e) {
        this.$store.dispatch('auth/logout')
        //alert("nice try");
        throw new Error('vx-error unauth')
      }
    }
  },
  render: h => h(App)
}).$mount('#app')
