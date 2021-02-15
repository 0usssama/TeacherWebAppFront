import SeanceService from '@/services/SeanceService.js'

export default {
  namespaced: true,
  state: {
    seances: [],
    times: []
  },
  mutations: {
    SET_SEANCE(state, seances) {
      state.seances = seances
    },
    SET_ONE_SEANCE(state, times) {
      state.times = times
    },
    ADD_SEANCE(state, seance) {
      state.seances.push(seance)
    },
    DELETE_SEANCE(state, payload) {
      state.seances.splice(payload.index, 1)
    },
    UPDATE_SEANCE(state, payload) {
      Object.assign(state.seances[payload.index], payload.seance)
    },
    UPDATE_TIME(state, payload) {
      Object.assign(state.times[payload.index], payload.time)
    }
  },
  actions: {
    async fetchSeances({ commit }) {
      try {
        await SeanceService.getSeances().then(response => {
          commit('SET_SEANCE', response.data)
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error fetching seances')
      }
    },
    async fetchSeanceStudent({ commit }, payload) {
      try {
        await SeanceService.fetchOneSeance(
          payload.seance_id,
          payload.student_id
        ).then(response => {
          commit('SET_ONE_SEANCE', response.data)
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error fetching one seance')
      }
    },
    async createSeance({ commit }, payload) {
      try {
        await SeanceService.postSeance(payload.seance).then(response => {
          commit('ADD_SEANCE', response.data)
        })
      } catch (error) {
        throw new Error('vx-error creating seance')
      }
    },
    async deleteSeances({ commit }, payload) {
      try {
        await SeanceService.deleteSeance(payload.seance).then(() => {
          commit('DELETE_SEANCE', payload)
        })
      } catch (error) {
        throw new Error('vx-error deleting seance')
      }
    },
    async updateSeances({ commit }, payload) {
      try {
        await SeanceService.updateSeance(payload).then(res => {
          commit('UPDATE_SEANCE', {
            seance: res.data,
            index: payload.index
          })
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error updating seance')
      }
    },
    async validateTime({ commit }, payload) {
      try {
        await SeanceService.validateOneTime(payload.time).then(res => {
          commit('UPDATE_TIME', {
            time: res.data,
            index: payload.index
          })
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error updating seance')
      }
    }
  }
}
