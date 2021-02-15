<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="PaymentsTableData"
      sort-by="id"
      sort-desc=""
      :search="search"
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

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>payments</v-toolbar-title>
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
                Add payment
              </v-btn>
            </template>
            <ValidationObserver
              ref="paymentValidation"
              v-slot="{ invalid, handleSubmit }"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="4">
                        <ValidationProvider
                          mode="lazy"
                          name="observation"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <!--
                          <v-text-field
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.observation"
                            label="observation"
                          ></v-text-field>
-->
                          <v-textarea
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.observation"
                            color="teal"
                          >
                            <template v-slot:label>
                              <div>Observation</div>
                            </template>
                          </v-textarea>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12" sm="12" md="8">
                        <v-row>
                          <v-col cols="12" sm="12" md="6">
                            <ValidationProvider
                              mode="lazy"
                              name="seance_id"
                              rules="required"
                              v-slot="{ errors, valid }"
                            >
                              <v-autocomplete
                                :error-messages="errors"
                                :success="valid"
                                v-model="editedItem.seance_id"
                                :items="seance.seances"
                                item-text="name"
                                item-value="id"
                                label="Seance"
                                ref="myAutoComplete"
                              ></v-autocomplete>
                            </ValidationProvider>
                          </v-col>

                          <v-col cols="12" sm="12" md="6">
                            <ValidationProvider
                              mode="lazy"
                              name="student_id"
                              rules="required"
                              v-slot="{ errors, valid }"
                            >
                              <v-autocomplete
                                :readonly="editMode"
                                :error-messages="errors"
                                :success="valid"
                                v-model="editedItem.student_id"
                                :items="student.students"
                                :item-text="
                                  item => item.firstName + ' ' + item.lastName
                                "
                                item-value="id"
                                label="Student"
                              ></v-autocomplete>
                            </ValidationProvider>
                          </v-col>

                          <v-col cols="12" sm="12" md="6">
                            <ValidationProvider
                              mode="lazy"
                              name="price"
                              rules="required"
                              v-slot="{ errors, valid }"
                            >
                              <v-text-field
                                :error-messages="errors"
                                :success="valid"
                                v-model="editedItem.price"
                                label="price"
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
                                  name="paymentDate"
                                  rules="required"
                                  v-slot="{ errors, valid }"
                                >
                                  <v-text-field
                                    :error-messages="errors"
                                    :success="valid"
                                    v-model="editedItem.paymentDate"
                                    label="Payment Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </ValidationProvider>
                              </template>
                              <v-date-picker
                                v-model="editedItem.paymentDate"
                                @input="menu2 = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
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
      { text: 'Student', value: 'student', filterable: true },

      { text: 'Seance', value: 'seance', filterable: true },

      { text: 'Date', value: 'paymentDate' },
      { text: 'price', value: 'price' },
      { text: 'observation', value: 'observation' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: '',
      seance_id: '',
      student_id: '',
      paymentDate: new Date().toISOString().substr(0, 10),
      price: '',
      observation: ''
    },
    defaultItem: {
      id: '',
      seance_id: '',
      student_id: '',
      paymentDate: new Date().toISOString().substr(0, 10),
      price: '',
      observation: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New payment' : 'Edit payment'
    },
    editMode() {
      return this.editedIndex === -1 ? false : true
    },
    PaymentsTableData() {
      return this.payment.payments.map(e => {
        return {
          id: e.id,
          observation: e.observation,
          paymentDate: e.paymentDate,
          price: e.price + ' DA',
          seance: e.seance.name,
          student: e.student.firstName + ' ' + e.student.lastName,
          seance_id: e.seance.id,
          student_id: e.student.id
        }
      })
    },

    ...mapState(['payment', 'seance', 'student'])
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  async created() {
    this.fetchPayments()
    await this.fetchSeances()
    await this.fetchStudents()
    this.initSeancesAutoComplete()
  },

  methods: {
    ...mapActions({
      fetchPayments: 'payment/fetchPayments',
      deletePayments: 'payment/deletePayments',
      updatePayment: 'payment/updatePayments',
      createPayment: 'payment/createPayment',
      fetchSeances: 'seance/fetchSeances',
      fetchStudents: 'student/fetchStudents'
    }),

    clear() {
      this.$refs.paymentValidation.reset()
    },
    initSeancesAutoComplete() {
      this.seancesItems = this.seance
    },
    alerting(message) {
      this.$swal('Good job!', message, 'success')
    },

    editItem(item) {
      this.file = []

      this.editedIndex = this.payment.payments.findIndex(element => {
        if (element.id == item.id) {
          return true
        }
      })
      //console.log(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      const index = this.payment.payments.indexOf(item)

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
            this.deletePayments({
              payment: item,
              index: index
            })
            this.$swal('Deleted!', 'Your payment has been deleted.', 'success')
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
          await this.updatePayment({
            payment: this.editedItem,
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
          await this.createPayment({
            payment: this.editedItem
          })

          this.alerting('payment creating successfully')
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
