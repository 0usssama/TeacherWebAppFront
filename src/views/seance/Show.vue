<template>
  <div class="container">
    <h1>Seance {{ nameOfSeance }} of student {{ nameOfStudent }}</h1>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              #
            </th>
            <th class="text-left">
              Type
            </th>
            <th>
              validation Date
            </th>
            <th class="text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="time in times" :key="time.id">
            <td>{{ time.id }}</td>
            <td>
              <div v-if="time.type">
                <v-chip
                  class="ma-2"
                  :color="time.type == 'P' ? 'success' : 'error'"
                  outlined
                  pill
                >
                  {{ time.type }}
                  <v-icon right>
                    mdi-account-outline
                  </v-icon>
                </v-chip>
              </div>
              <v-chip v-else class="ma-2" color="red" text-color="white">
                not validated
              </v-chip>
            </td>
            <td>
              <div v-if="time.validationDate">
                {{ time.validationDate }}
              </div>
              <v-chip v-else class="ma-2" color="red" text-color="white">
                not validated
              </v-chip>
            </td>
            <td>
              <v-btn
                :disabled="time.type != null"
                @click="validate(time, 'P')"
                elevation="2"
                class="mx-2"
                color="success"
              >
                <v-icon dark>
                  mdi-account-check
                </v-icon>
              </v-btn>

              <v-btn
                :disabled="time.type != null"
                @click="validate(time, 'A')"
                elevation="2"
                color="error"
              >
                <v-icon dark>
                  mdi-account-cancel
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      editedIndex: -1,
      nameOfSeance: '',
      nameOfStudent: '',
      seance_id: this.$route.params.seance_id,
      student_id: this.$route.params.student_id
    }
  },
  computed: {
    ...mapState('seance', ['times'])
  },
  methods: {
    ...mapActions({
      fetchSeanceStudent: 'seance/fetchSeanceStudent',
      validateTime: 'seance/validateTime'
    }),
    alerting(message) {
      this.$swal('Good job!', message, 'success')
    },
    async validate(item, type) {
      this.editedIndex = this.times.indexOf(item)
      item.type = type
      if (this.editedIndex > -1) {
        try {
          await this.validateTime({
            time: item,
            index: this.editedIndex
          })

          this.alerting('everything is up to date')
        } catch (error) {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      }
    }
  },
  async created() {
    await this.fetchSeanceStudent({
      seance_id: this.seance_id,
      student_id: this.student_id
    })
  },
  watch: {
    times(newValue) {
      this.nameOfSeance = newValue[0].seance.name
      this.nameOfStudent =
        newValue[0].student.firstName + ' ' + newValue[0].student.lastName
    }
  }
}
</script>

<style></style>
