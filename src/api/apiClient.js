import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://pms-backend-lnl1.onrender.com/api",
});

export default api;
