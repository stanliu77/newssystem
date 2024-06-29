import axios from "axios";
import {store} from "../redux/store";
import { loading } from "../redux/reducer/loadSlice";
axios.defaults.baseURL = "http://localhost:5000"
axios.interceptors.request.use(function (config) {
    store.dispatch(
        // type: 'loading',
        // payload: true
        loading(true)
    )
    return config;
}, function (error) {

    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    store.dispatch(
        // type: 'loading',
        // payload: false
        loading(false)
    )
    return response;
}, function (error) {
    store.dispatch(
        // type: 'loading',
        // payload: false
        loading(true)
    )
    return Promise.reject(error);
});