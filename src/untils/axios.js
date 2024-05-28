import axios from 'axios'
import { getCookie, removeCookie } from "./auth"

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.baseURL = "/api"
axios.interceptors.request.use((config) => {
    if (getCookie("token_admin")) {
        config.headers['Authorization'] = getCookie("token_admin")
    }
    return config
}, err => {
    new Promise.reject(err)
})
axios.interceptors.response.use((response) => {
    if (response.data.code === 421) {
        removeCookie("token_admin")
    }
    return response.data
}, err => {
    Promise.reject(err)
})
export default axios