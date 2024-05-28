import axios from "../../untils/axios"
export default {
    getSystemRotographList: (params) => {
        return axios({
            method: "get",
            url: "/system/getSystemRotographList",
            params
        })
    },
    addSystemRotograph: (formData) => {
        return axios({
            method: "post",
            url: "/system/addSystemRotograph",
            data: formData
        })
    },
    editSystemRotograph: (formData) => {
        return axios({
            method: "post",
            url: "/system/editSystemRotograph",
            data: formData
        })
    },
    deleteSystemRotograph: (id) => {
        return axios({
            method: "get",
            url: `/system/deleteSystemRotograph/${id}`,
        })
    },
    addSystemRotographImage: (formData) => {
        return axios({
            method: "post",
            url: "/system/addSystemRotographImage",
            data: formData
        })
    },
}