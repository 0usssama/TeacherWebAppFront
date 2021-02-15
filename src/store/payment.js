import PaymentService from '@/services/PaymentService.js'

export default {
  namespaced: true,
  state: {
    payments: []
  },
  mutations: {
    SET_PAYMENT(state, payments) {
      state.payments = payments
    },
    ADD_PAYMENT(state, payment) {
      state.payments.push(payment)
    },
    DELETE_PAYMENT(state, payload) {
      state.payments.splice(payload.index, 1)
    },
    UPDATE_PAYMENT(state, payload) {
      Object.assign(state.payments[payload.index], payload.payment)
    }
  },
  actions: {
    async fetchPayments({ commit }) {
      try {
        await PaymentService.getPayments().then(response => {
          commit('SET_PAYMENT', response.data)
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error fetching payments')
      }
    },
    async createPayment({ commit }, payload) {
      try {
        await PaymentService.postPayment(payload.payment).then(response => {
          commit('ADD_PAYMENT', response.data)
        })
      } catch (error) {
        throw new Error('vx-error creating payment')
      }
    },
    async deletePayments({ commit }, payload) {
      try {
        await PaymentService.deletePayment(payload.payment).then(() => {
          commit('DELETE_PAYMENT', payload)
        })
      } catch (error) {
        throw new Error('vx-error deleting payment')
      }
    },
    async updatePayments({ commit }, payload) {
      try {
        await PaymentService.updatePayment(payload).then(res => {
          commit('UPDATE_PAYMENT', {
            payment: res.data,
            index: payload.index
          })
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error updating payment')
      }
    }
  }
}
