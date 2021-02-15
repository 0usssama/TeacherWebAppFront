import { apiClient } from './ApiClient'
export default {
  getPayments() {
    return apiClient.get('payments')
  },

  updatePayment(payload) {
    return apiClient.put('payments/' + payload.payment.id, payload.payment)
  },
  postPayment(payment) {
    return apiClient.post('payments', payment)
  },
  deletePayment(payment) {
    return apiClient.delete('payments/' + payment.id, payment)
  }
}
