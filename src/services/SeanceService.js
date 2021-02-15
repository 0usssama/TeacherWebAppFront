import { apiClient } from './ApiClient'
export default {
  getSeances() {
    return apiClient.get('seances')
  },
  fetchOneSeance(seance_id, student_id) {
    return apiClient.get('seances/' + seance_id + '/' + student_id)
  },
  updateSeance(payload) {
    return apiClient.put('seances/' + payload.seance.id, payload.seance)
  },
  postSeance(seance) {
    return apiClient.post('seances', seance)
  },
  deleteSeance(seance) {
    return apiClient.delete('seances/' + seance.id, seance)
  },
  validateOneTime(time) {
    return apiClient.put('times/' + time.id, time)
  }
}
