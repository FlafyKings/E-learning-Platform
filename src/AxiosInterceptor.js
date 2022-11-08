import axios, { Axios } from "axios";

const AxiosInterceptor = axios.interceptors.request.use(function (config) {
    const token = "BEARER " + localStorage.getItem("jwtToken");
    config.headers.Authorization =  token;

    return config;
});

export default axios;