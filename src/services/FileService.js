import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://127.0.0.1:8000/`,
  withCredentials: false, // This is the default
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 10000,
});

export default {
  uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    return apiClient.post("store-file", formData);
  },
};
