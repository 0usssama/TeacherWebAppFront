<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="slider"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:item.slider_buttons="{ item }">
        <div v-for="(btn, index) in item.slider_buttons" :key="index">
          <b>name </b> {{ btn.name }} <br />
          <b>Page:</b> {{ btn.page }}
          <br />
        </div>
      </template>

      <template v-slot:item.imgSrc="{ item }">
        <v-img
          max-height="150"
          max-width="250"
          :src="'http://localhost/fileUploadProject/storage/app/' + item.imgSrc"
        ></v-img>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Slider</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog">
            <ValidationObserver ref="obs" v-slot="{ invalid, handleSubmit }">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-file-input
                          v-model="file"
                          color="deep-purple accent-4"
                          counter
                          label="File input"
                          placeholder="Select your files"
                          prepend-icon="mdi-paperclip"
                          outlined
                          :show-size="1000"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider
                          mode="lazy"
                          name="title1"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <v-text-field
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.title1"
                            label="title 1"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider
                          mode="lazy"
                          name="title2"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <v-text-field
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.title2"
                            name="body"
                            label="title 2"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider
                          mode="lazy"
                          name="subTitle1"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <v-text-field
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.subTitle1"
                            name="body"
                            label="Subtitle 1"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider
                          mode="lazy"
                          name="subTitle2"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <v-text-field
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.subTitle2"
                            name="body"
                            label="Subtitle 2"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                    <v-row
                      v-for="(btn, index) in editedItem.slider_buttons"
                      :key="index"
                    >
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider
                          mode="lazy"
                          name="slider_buttons"
                          rules="required"
                          v-slot="{ errors, valid }"
                        >
                          <v-text-field
                            :error-messages="errors"
                            :success="valid"
                            v-model="editedItem.slider_buttons[index].name"
                            name="body"
                            :label="'Button ' + (index + 1)"
                          ></v-text-field>
                        </ValidationProvider>
                        <v-autocomplete
                          v-model="editedItem.slider_buttons[index].page"
                          :items="NavItems"
                          item-text="title"
                          item-value="route"
                          filled
                          label="Filled"
                        ></v-autocomplete>
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
      </template>
      <template v-slot:no-data>
        <h2>No data</h2>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    file: [],
    readers: [],
    rules: [
      (value) =>
        !value ||
        value.size < 5000000 ||
        "Avatar size should be less than 5 MB!",
    ],
    dialog: false,
    headers: [
      {
        text: "#",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "Image", value: "imgSrc" },
      { text: "Title 1", value: "title1" },
      { text: "Title 2", value: "title2" },
      { text: "Buttons", value: "slider_buttons" },

      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id: "",
      imgSrc: "",
      title1: "",
      title2: "",
      slider_buttons: {},
    },
    defaultItem: {
      id: "",
      imgSrc: "",
      title1: "",
      title2: "",
      slider_buttons: {},
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },

    ...mapState(["slider", "NavItems"]),
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  async created() {
    await this.fetchSlider();
  },

  methods: {
    ...mapActions(["deleteSlider", "updateSlider", "fetchSlider"]),
    alerting(message) {
      this.$swal("Good job!", message, "success");
    },

    editItem(item) {
      this.file = [];

      this.editedIndex = this.slider.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.slider.indexOf(item);

      let swalPromise = this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      await swalPromise.then((result) => {
        if (result.isConfirmed) {
          try {
            this.deleteSlider({
              slider: item,
              index: index,
            }).then(() => {
              this.$swal(
                "Deleted!",
                "Your slider has been deleted.",
                "success"
              );
            });
          } catch (error) {
            console.log(
              "There was a dispatch problem deleting your slider" +
                error.response
            );
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        }
      });
    },

    close() {
      requestAnimationFrame(() => {
        this.$refs.obs.reset();
      });
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      //hna
      if (this.editedIndex > -1) {
        let updatePromise = this.updateSlider({
          slider: this.editedItem,
          index: this.editedIndex,
          file: this.file,
        });

        try {
          await updatePromise.then(() => {
            //this.$swal("Good job!", "Everything is up to date!", "success");
            this.alerting("everything is up to date");
          });
        } catch (error) {
          this.$swal({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong when updating your slider!",
          });
        }
      }
      this.close();
    },
  },
};
</script>
