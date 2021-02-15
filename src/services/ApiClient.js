import axios from 'axios'
import store from '../store/index'

export const apiClient = axios.create({
  baseURL: `http://127.0.0.1:8000`,
  // baseURL: "http://www.api.example.local/",

  withCredentials: true, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
})
apiClient.interceptors.request.use(config => {
  // Get token from auth.js store
  const token = store.state.auth.token

  if (token) {
    config.headers.common['Authorization'] = 'Bearer ' + token
  }
  return config
})
