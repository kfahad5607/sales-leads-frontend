import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
