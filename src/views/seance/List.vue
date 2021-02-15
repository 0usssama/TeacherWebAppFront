<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="SeancesTableData"
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
        <td v-if="item.students !== []" :colspan="headers.length">
          <h4 class="mx-3 my-3">Students</h4>
          <v-simple-table class="my-3">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ref</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone number</th>
                  <th>Hiring date</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in item.students" :key="student.id">
                  <td>{{ student.id }}</td>
                  <td>{{ student.ref }}</td>
                  <td>{{ student.firstName }}</td>
                  <td>{{ student.lastName }}</td>
                  <td>{{ student.phoneNumber }}</td>
                  <td>{{ student.hiringDate }}</td>
                  <td>{{ student.level }}</td>
                  <td>
                    <!--  :to="'/seances/' + item.id + '/' + student.id"-->
                    <v-btn
                      :to="'/seances/' + item.id + '/' + student.id"
                      class="mx-2"
                      fab
                      dark
                      small
                      color="primary"
                    >
                      <v-icon dark>
                        mdi-information-outline
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>seances</v-toolbar-title>
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
                @click="clear"
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Add seance
              </v-btn>
            </template>
            <ValidationObserver
              ref="seanceForm"
              v-slot="{ invalid, handleSubmit }"
            >
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
                          name="Name"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <v-text-field
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.name"
                            label="name"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12" sm="12" md="6">
                        <ValidationProvider
                          mode="lazy"
                          name="observation"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.students"
                            :items="student.students"
                            :item-text="
                              item => item.firstName + ' ' + item.lastName
                            "
                            item-value="id"
                            multiple
                            label="Students"
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
    expanded: [],
    singleExpand: false,
    studentOfSeance: '',
    seancesItems: null,
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
      { text: 'Name', value: 'name' },
      { text: 'state', value: 'state' },

      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: '',
      name: '',
      state: '',
      students: ''
    },
    defaultItem: {
      id: '',
      name: '',
      state: '',
      students: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    SeancesTableData() {
      return this.seance.seances.map(e => {
        return {
          id: e.id,
          name: e.name,
          state: e.state,
          students: e.students,
          times: e.times
        }
      })
    },

    ...mapState(['seance', 'student'])
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  async created() {
    this.fetchSeances()
    await this.fetchSeances()
    await this.fetchStudents()
    this.initSeancesAutoComplete()
  },

  methods: {
    ...mapActions({
      fetchSeances: 'seance/fetchSeances',
      deleteSeances: 'seance/deleteSeances',
      updateSeance: 'seance/updateSeances',
      createSeance: 'seance/createSeance',
      fetchStudents: 'student/fetchStudents'
    }),

    clear() {
      this.$refs.seanceForm.reset()
    },
    initSeancesAutoComplete() {
      this.seancesItems = this.seance
    },
    alerting(message) {
      this.$swal('Good job!', message, 'success')
    },

    editItem(item) {
      this.file = []

      this.editedIndex = this.seance.seances.findIndex(element => {
        if (element.id == item.id) {
          return true
        }
      })
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      const index = this.seance.seances.indexOf(item)

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
            this.deleteSeances({
              seance: item,
              index: index
            })
            this.$swal('Deleted!', 'Your seance has been deleted.', 'success')
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
          await this.updateSeance({
            seance: this.editedItem,
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
          await this.createSeance({
            seance: this.editedItem
          })

          this.alerting('seance creating successfully')
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
