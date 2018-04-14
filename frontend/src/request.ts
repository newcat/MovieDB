import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8050/",
    timeout: 1000,
});
