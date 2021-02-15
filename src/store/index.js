import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import PostsService from '@/services/PostsService.js'
import SliderService from '@/services/SliderService.js'
import FileService from '@/services/FileService.js'
import payment from './payment'
import seance from './seance'
import student from './student'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: null,
    drawerState: true,
    slider: [],
    posts: [],
    NavItems: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/' },
      {
        title: 'Students',
        icon: 'mdi-account-supervisor-circle',
        route: '/students'
      },
      { title: 'Payments', icon: 'mdi-account-cash', route: '/payments' },

      {
        title: 'Seances',
        icon: 'mdi-newspaper-variant-multiple',
        route: '/seances'
      }
      //{ title: 'Test', icon: 'mdi-view-dashboard', route: '/test' }

      // { title: "About", icon: "mdi-help-box", route: "/about" },
      // { title: "Slider", icon: "mdi-help-box", route: "/slider" },
    ]
  },
  mutations: {
    SET_DRAWER(state) {
      state.drawerState = true
    },
    SWITCH_DRAWER(state) {
      state.drawerState = !state.drawerState
    },
    SET_AUTH(state) {
      state.authenticated = !state.authenticated
    },
    SET_POSTS(state, posts) {
      state.posts = posts
    },
    ADD_POST(state, post) {
      state.posts.push(post)
    },
    UPDATE_POST(state, payload) {
      //hna
      //console.log("updated mutation");
      Object.assign(state.posts[payload.index], payload.post)
    },
    DELETE_POST(state, payload) {
      //this.posts.splice(index, 1);
      state.posts.splice(payload.index, 1)
      console.log('delete mutation')
    },
    SET_SLIDER(state, slider) {
      state.slider = slider
    },
    UPDATE_SLIDER(state, payload) {
      Object.assign(state.slider[payload.index], payload.slider)
    }
  },
  actions: {
    setDrawer({ commit }) {
      commit('SET_DRAWER')
    },
    drawerSwitch({ commit }) {
      commit('SWITCH_DRAWER')
    },
    logSwitch({ commit }) {
      commit('SET_AUTH')
    },
    async createPost({ commit }, post) {
      try {
        await PostsService.postPost(post).then(res => {
          // console.log("creating promise vuex");
          commit('ADD_POST', res.data)
        })
      } catch (error) {
        //console.log("There was an error store adding request:", error.response);
        throw new Error('vx-error creating post')
      }
    },
    async fetchPosts({ commit }) {
      try {
        await PostsService.getPosts().then(response => {
          commit('SET_POSTS', response.data)
        })
      } catch (error) {
        //console.log("There was an error:", error.response);
        throw new Error('vx-error fetching post')
      }
    },
    async updatePost({ commit }, payload) {
      //console.log(payload);
      try {
        await PostsService.updatePost(payload.post).then(res => {
          // console.log("updated action");

          commit('UPDATE_POST', {
            post: res.data,
            index: payload.index
          })
        })
      } catch (error) {
        // console.log(error.response);
        throw new Error('vx-error updating post')
      }
    },
    async deletePost({ commit }, payload) {
      try {
        await PostsService.deletePost(payload.post).then(() => {
          console.log('delete action')
          commit('DELETE_POST', {
            post: payload.post,
            index: payload.index
          })
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error deleting post')
      }
    },
    async fetchSlider({ commit }) {
      try {
        await SliderService.getSlider().then(response => {
          commit('SET_SLIDER', response.data)
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error fetching slider')
      }
    },
    async updateSlider({ commit }, payload) {
      try {
        payload.slider.imgSrc = payload.file.name
          ? (await FileService.uploadFile(payload.file)).data.file
          : this.state.slider[payload.index].imgSrc
        await SliderService.updateSlider(payload).then(() => {
          commit('UPDATE_SLIDER', {
            slider: payload.slider,
            index: payload.index
          })
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error updating post')
      }
    }
  },
  modules: { auth, payment, seance, student },
  getters: {}
})
