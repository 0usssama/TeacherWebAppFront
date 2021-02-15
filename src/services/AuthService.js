import { apiClient } from './ApiClient'

export default {
  Login(user) {
    return apiClient.post('login', user)
  },
  LoginWithToken(token) {
    return apiClient.get('user', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }
}
