import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://jsonplaceholder.typicode.com/`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=UTF-8",
  },
  timeout: 10000,
});

export default {
  /** 
  getEvents(perPage, page) {
    return apiClient.get("/events?_limit=" + perPage + "&_page=" + page);
  },*/

  getPosts() {
    return apiClient.get("/posts/");
  },

  postPost(post) {
    return apiClient.post("/posts", post);
  },
  updatePost(post) {
    return apiClient.put("/posts/" + post.id, post);
  },
  deletePost(post) {
    return apiClient.delete("/posts/" + post.id, post);
  },
};
