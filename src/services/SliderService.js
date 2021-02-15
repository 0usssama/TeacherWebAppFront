import { apiClient } from './ApiClient'

export default {
  getSlider() {
    return apiClient.get('sliders')
  },

  updateSlider(payload) {
    return apiClient.put('sliders/' + payload.slider.id, payload.slider)
  }
}
