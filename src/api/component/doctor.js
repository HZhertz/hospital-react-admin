import axios from "../../untils/axios"

export default {
    getDoctorList: (params) => {
        return axios({
            method: "get",
            url: "/system/getDoctorList",
            params
        })
    },
    addDoctor: (formData) => {
        return axios({
            method: "post",
            url: "/system/addDoctor",
            data: formData
        })
    },
    editDoctor: (formData) => {
        return axios({
            method: "post",
            url: "/system/editDoctor",
            data: formData
        })
    },
    deleteDoctor: (id) => {
        return axios({
            method: "get",
            url: `/system/deleteDoctor/${id}`,
        })
    },
    uploadDoctor: (data) => {
        return axios({
            method: "post",
            url: `/system/uploadDoctor`,
            data
        })
    }
}