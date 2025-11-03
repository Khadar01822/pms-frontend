
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ← this reads your backend URL
});

export default api;
