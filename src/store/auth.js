import AuthService from "@/services/AuthService.js";
export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("user", token);
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem("user");
      location.reload();
    },
  },
  actions: {
    async signIn({ commit, dispatch }, user) {
      try {
        let response = await AuthService.Login(user);
        commit("SET_TOKEN", response.data.token);
        dispatch("logSwitch", null, { root: true });
      } catch (e) {
        throw new Error("vx-error unauthorized");
      }
    },
    async tokenLogin({ commit, dispatch }, token) {
      try {
        await AuthService.LoginWithToken(token).then(() => {
          commit("SET_TOKEN", token);
          dispatch("logSwitch", null, { root: true });
        });
      } catch (e) {
        throw new Error("vx-error unauthorized");
      }
    },
    logout({ commit }) {
      commit("CLEAR_USER_DATA");
    },
  },
};
