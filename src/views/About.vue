<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="posts"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My CRUD template</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.userId"
                        label="user ID"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.title"
                        label="title"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.body"
                        name="body"
                        label="body"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
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
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "#",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "User ID", value: "userId" },
      { text: "Title", value: "title" },
      { text: "Body", value: "body" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id: "",
      userId: "",
      title: "",
      body: "",
    },
    defaultItem: {
      id: "",
      userId: "",
      title: "",
      body: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },

    ...mapState(["posts"]),
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.$store.dispatch("fetchPosts");

    this.initialize();
  },

  methods: {
    initialize() {},

    editItem(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      /*
      const index = this.posts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.posts.splice(index, 1);*/
      const index = this.posts.indexOf(item);

      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store
            .dispatch("deletePost", {
              post: item,
              index: index,
            })
            .then(() => {
              this.$swal("Deleted!", "Your post has been deleted.", "success");
            })
            .catch(() => {
              console.log("There was a dispatch problem deleting your event");
            });
        }
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      //hna
      if (this.editedIndex > -1) {
        // Object.assign(this.posts[this.editedIndex], this.editedItem);
        this.$store
          .dispatch("updatePost", {
            post: this.editedItem,
            index: this.editedIndex,
          })
          .catch(() => {
            console.log("There was a dispatch problem updating your event");
          });
      } else {
        //this.posts.push(this.editedItem);
        //console.log(this.editedItem);
        this.$store
          .dispatch("createPost", this.editedItem)
          .then(() => {
            //console.log("it works, posted!");
            this.$swal("Good job!", "Post created!", "success");
          })
          .catch(() => {
            console.log("There was a problem dispatch creating your event");
          });
      }
      this.close();
    },
  },
};
</script>
