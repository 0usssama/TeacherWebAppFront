import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://127.0.0.1:8000/`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
  },
  timeout: 10000,
});

export default {
  getSlider() {
    return apiClient.get("sliders");
  },

  updateSlider(payload) {
    return apiClient.put("sliders/" + payload.slider.id, payload.slider);
  },
};
