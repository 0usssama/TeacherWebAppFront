<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="StudentsTableData"
      sort-by="id"
      sort-desc=""
      :search="search"
      show-expand
      :single-expand="singleExpand"
    >
      <!-- 
      <template v-slot:item.stars="{ item }">
        <v-btn class="ma-2" color="orange darken-2" dark>
          <v-icon dark left>
            mdi-star
          </v-icon>
          {{ item.stars + '/' + '5' }}
        </v-btn>
      </template>
-->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div v-if="item.seances !== []">
            <h4 class="mx-3 my-3">Seances</h4>
            <v-simple-table class="my-3">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="seance in item.seances" :key="seance.id">
                    <td>{{ seance.id }}</td>
                    <td>{{ seance.name }}</td>
                    <td>{{ seance.state }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <div v-if="item.payments !== []">
            <h4 class="mx-3 my-3">Payments</h4>
            <v-simple-table class="my-3">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Price</th>
                    <th>Observation</th>
                    <th>Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in item.payments" :key="payment.id">
                    <td>{{ payment.id }}</td>
                    <td>{{ payment.price }}</td>
                    <td>{{ payment.observation }}</td>
                    <td>{{ payment.paymentDate }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </td>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>students</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>

          <v-dialog eager v-model="dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="resetForm"
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Add student
              </v-btn>
            </template>
            <ValidationObserver
              ref="studentForm"
              v-slot="{ invalid, handleSubmit }"
            >
              <form>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="6">
                          <ValidationProvider
                            mode="lazy"
                            name="firstName"
                            rules="required"
                            v-slot="{ errors, valid }"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :success="valid"
                              v-model="editedItem.firstName"
                              label="First Name"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-col>

                        <v-col cols="12" sm="12" md="6">
                          <ValidationProvider
                            mode="lazy"
                            name="lastName"
                            rules="required"
                            v-slot="{ errors, valid }"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :success="valid"
                              v-model="editedItem.lastName"
                              label="Last Name"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-col>

                        <v-col cols="12" sm="12" md="6">
                          <ValidationProvider
                            mode="lazy"
                            name="phoneNumber"
                            rules="required"
                            v-slot="{ errors, valid }"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :success="valid"
                              prepend-icon="mdi-card-account-phone"
                              v-model="editedItem.phoneNumber"
                              label="Phone number"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <ValidationProvider
                                mode="lazy"
                                name="hiringDate"
                                rules="required"
                                v-slot="{ errors, valid }"
                              >
                                <v-text-field
                                  :error-messages="errors"
                                  :success="valid"
                                  v-model="editedItem.hiringDate"
                                  label="Hiring date"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </ValidationProvider>
                            </template>
                            <v-date-picker
                              v-model="editedItem.hiringDate"
                              @input="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>

                        <v-col
                          :cols="editedIndex !== -1 ? '6' : '12'"
                          :sm="editedIndex !== -1 ? '6' : '12'"
                          :md="editedIndex !== -1 ? '6' : '12'"
                        >
                          <ValidationProvider
                            mode="lazy"
                            name="level"
                            rules="required"
                            v-slot="{ errors, valid }"
                          >
                            <v-autocomplete
                              prepend-icon="mdi-account-details"
                              :error-messages="errors"
                              :success="valid"
                              v-model="editedItem.level"
                              :items="people"
                              color="blue-grey lighten-2"
                              label="Level"
                              item-text="name"
                              item-value="name"
                            >
                            </v-autocomplete>
                          </ValidationProvider>
                        </v-col>

                        <v-col
                          v-if="editedIndex !== -1"
                          cols="12"
                          sm="12"
                          md="6"
                        >
                          <ValidationProvider
                            mode="lazy"
                            name="observation"
                            rules="required"
                            v-slot="{ errors, valid }"
                          >
                            <v-autocomplete
                              :error-messages="errors"
                              :success="valid"
                              v-model="editedItem.seances"
                              :items="seance.seances"
                              item-text="name"
                              item-value="id"
                              multiple
                              label="Seances"
                            ></v-autocomplete>
                          </ValidationProvider>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="handleSubmit(save)"
                      :disabled="invalid"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </form>
            </ValidationObserver>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <h1>Empty data</h1>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({
    people: [
      { header: '1st year' },
      { name: '1st Sc' },
      { divider: true },
      { header: '2nd YEAR' },
      { name: '2nd GE Math' },
      { name: '2nd GE Math/Accounting' },
      { name: '2nd SC Math' },
      { name: '2nd TM Math' },
      { divider: true },
      { header: 'TERMINAL' },
      { name: 'Terminal Math GE' },
      { name: 'Terminal Math SC' },
      { name: 'Terminal Math TM' },
      { name: 'Terminal Math LV' }
    ],
    expanded: [],
    singleExpand: false,
    studentOfStudent: '',
    studentsItems: null,
    search: '',
    rootImage: process.env.VUE_APP_IMAGE_URL,
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    file: [],
    readers: [],
    rules: [
      value =>
        !value ||
        value.size < 5000000 ||
        'Avatar size should be less than 5 MB!'
    ],
    dialog: false,
    headers: [
      {
        text: '#',
        align: 'start',
        sortable: true,
        value: 'id'
      },
      { text: 'Reference', value: 'ref' },
      { text: 'First Name', value: 'firstName' },
      { text: 'Last Name ', value: 'lastName' },
      { text: 'Phone number', value: 'phoneNumber' },
      { text: 'Hiring Date', value: 'hiringDate' },
      { text: 'Level', value: 'level' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      hiringDate: '',
      level: '',
      ref: '/',
      seances: '',
      payments: ''
    },
    defaultItem: {
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      hiringDate: '',
      level: '',
      ref: '/',
      seances: '',
      payments: ''
    }
  }),
  mounted() {},
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New student' : 'Edit student'
    },
    StudentsTableData() {
      return this.student.students.map(e => {
        return {
          id: e.id,
          firstName: e.firstName,
          lastName: e.lastName,
          phoneNumber: e.phoneNumber,
          hiringDate: e.hiringDate,
          level: e.level,
          ref: e.ref,
          seances: e.seances,
          payments: e.payments
        }
      })
    },

    ...mapState(['student', 'student']),
    ...mapState(['seance', 'seance'])
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  async created() {
    await this.fetchStudents()
    await this.fetchSeances()
    this.initStudentsAutoComplete()
  },

  methods: {
    ...mapActions({
      fetchStudents: 'student/fetchStudents',
      fetchSeances: 'seance/fetchSeances',
      deleteStudents: 'student/deleteStudents',
      updateStudent: 'student/updateStudents',
      createStudent: 'student/createStudent'
    }),

    clear() {
      this.$refs.studentForm.reset()
    },

    resetForm() {
      this.$refs.form.reset()
    },

    initStudentsAutoComplete() {
      this.studentsItems = this.student
    },
    alerting(message) {
      this.$swal('Good job!', message, 'success')
    },

    editItem(item) {
      this.file = []
      this.editedIndex = this.student.students.findIndex(element => {
        if (element.id == item.id) {
          return true
        }
      })
      console.log(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      const index = this.student.students.indexOf(item)

      let swalPromise = this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      await swalPromise.then(result => {
        if (result.isConfirmed) {
          try {
            this.deleteStudents({
              student: item,
              index: index
            })
            this.$swal('Deleted!', 'Your student has been deleted.', 'success')
          } catch (error) {
            this.$swal({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!'
            })
          }
        }
      })
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      //hna
      if (this.editedIndex > -1) {
        try {
          await this.updateStudent({
            student: this.editedItem,
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
      } else {
        try {
          await this.createStudent({
            student: this.editedItem
          })

          this.alerting('student creating successfully')
        } catch (error) {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      }
      this.close()
    }
  }
}
</script>
