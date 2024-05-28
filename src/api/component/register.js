import axios from "../../untils/axios"
export default {
    getRegisterList: (params) => {
        return axios({
            method: "get",
            url: '/system/getRegisterList',
            params
        })
    },
    addRegister: (formData) => {
        return axios({
            method: "post",
            url: "/system/addRegister",
            data: formData
        })
    },
    editRegister: (formData) => {
        return axios({
            method: "post",
            url: "/system/editRegister",
            data: formData
        })
    },
    deleteRegister: (id) => {
        return axios({
            method: "get",
            url: `/system/deleteRegister/${id}`,
        })
    },
}