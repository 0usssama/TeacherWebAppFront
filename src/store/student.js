import StudentService from '@/services/StudentService.js'

export default {
  namespaced: true,
  state: {
    students: []
  },
  mutations: {
    SET_STUDENT(state, students) {
      state.students = students
    },
    ADD_STUDENT(state, student) {
      state.students.push(student)
    },
    DELETE_STUDENT(state, payload) {
      state.students.splice(payload.index, 1)
    },
    UPDATE_STUDENT(state, payload) {
      Object.assign(state.students[payload.index], payload.student)
    }
  },
  actions: {
    async fetchStudents({ commit }) {
      try {
        await StudentService.getStudents().then(response => {
          commit('SET_STUDENT', response.data)
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error fetching students')
      }
    },
    async createStudent({ commit }, payload) {
      try {
        await StudentService.postStudent(payload.student).then(response => {
          commit('ADD_STUDENT', response.data)
        })
      } catch (error) {
        throw new Error('vx-error creating student')
      }
    },
    async deleteStudents({ commit }, payload) {
      try {
        await StudentService.deleteStudent(payload.student).then(() => {
          commit('DELETE_STUDENT', payload)
        })
      } catch (error) {
        throw new Error('vx-error deleting student')
      }
    },
    async updateStudents({ commit }, payload) {
      try {
        await StudentService.updateStudent(payload).then(res => {
          commit('UPDATE_STUDENT', {
            student: res.data,
            index: payload.index
          })
        })
      } catch (error) {
        //console.log(error);
        throw new Error('vx-error updating student')
      }
    }
  }
}
