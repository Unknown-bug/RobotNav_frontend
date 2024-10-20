import axios from "axios";

const api = axios.create({
    baseURL: "https://robot-nav-backend.vercel.app",
});

export default api;