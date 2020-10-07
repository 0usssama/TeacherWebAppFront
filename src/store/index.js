import Vue from "vue";
import Vuex from "vuex";

import PostsService from "@/services/PostsService.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    NavItems: [
      { title: "Dashboard", icon: "mdi-view-dashboard", route: "/" },

      { title: "About", icon: "mdi-help-box", route: "/about" },
    ],
  },
  mutations: {
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    ADD_POST(state, post) {
      state.posts.push(post);
    },
    UPDATE_POST(state, payload) {
      //hna
      //console.log("updated mutation");
      Object.assign(state.posts[payload.index], payload.post);
    },
    DELETE_POST(state, payload) {
      //this.posts.splice(index, 1);
      state.posts.splice(payload.index, 1);
      console.log("delete mutation");
    },
  },
  actions: {
    createPost({ commit }, post) {
      PostsService.postPost(post)
        .then(() => {
          commit("ADD_POST", post);
        })
        .catch((error) => {
          console.log(
            "There was an error store adding request:",
            error.response
          );
        });
    },
    fetchPosts({ commit }) {
      PostsService.getPosts()
        .then((response) => {
          commit("SET_POSTS", response.data);
        })
        .catch((error) => {
          console.log("There was an error:", error.response);
        });
    },
    updatePost({ commit }, payload) {
      //console.log(payload);
      PostsService.updatePost(payload.post)
        .then(() => {
          // console.log("updated action");
          commit("UPDATE_POST", {
            post: payload.post,
            index: payload.index,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deletePost({ commit }, payload) {
      PostsService.deletePost(payload.post)
        .then(() => {
          console.log("delete action");
          commit("DELETE_POST", {
            post: payload.post,
            index: payload.index,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  modules: {},
  getters: {},
});
