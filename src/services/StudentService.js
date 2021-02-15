import { apiClient } from './ApiClient'
export default {
  getStudents() {
    return apiClient.get('students')
  },
  fetchOneStudent(seance_id, student_id) {
    return apiClient.get('students/' + seance_id + '/' + student_id)
  },
  updateStudent(payload) {
    return apiClient.put('students/' + payload.seance.id, payload.seance)
  },
  postStudent(seance) {
    return apiClient.post('students', seance)
  },
  deleteStudent(seance) {
    return apiClient.delete('students/' + seance.id, seance)
  }
}
