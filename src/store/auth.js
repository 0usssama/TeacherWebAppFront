import AuthService from '@/services/AuthService.js'
export default {
  namespaced: true,
  state: {
    errors: '',
    token: null,
    user: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('user', token)
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem('user')
      location.reload()
    },
    SET_ERROR(state, errorMessage) {
      state.errors = ''
      state.errors += errorMessage
    },
    CLEAR_ERRORS(state) {
      state.errors = ''
    }
  },
  actions: {
    async signIn({ commit, dispatch }, user) {
      try {
        let response = await AuthService.Login(user)
        commit('SET_TOKEN', response.data.token)
        dispatch('logSwitch', null, { root: true })
      } catch (e) {
        //throw new Error('vx-error unauthorized')
        if (e.response) {
          //return e.response.data
          commit('SET_ERROR', e.response.data.message)
        }
      }
    },
    async tokenLogin({ commit, dispatch }, token) {
      try {
        await AuthService.LoginWithToken(token).then(() => {
          commit('SET_TOKEN', token)
          dispatch('logSwitch', null, { root: true })
        })
      } catch (e) {
        throw new Error('vx-error unauthorized')
      }
    },
    clear({ commit }) {
      commit('CLEAR_ERRORS')
    },

    logout({ commit }) {
      commit('CLEAR_USER_DATA')
    }
  }
}
