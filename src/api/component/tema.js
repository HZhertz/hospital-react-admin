import axios from "../../untils/axios"
export default {
    getTemaList: (params) => {
        return axios({
            method: "get",
            url: "/system/getTemaList",
            params
        })
    },
    addTema: (formData) => {
        return axios({
            method: "post",
            url: "/system/addTema",
            data: formData
        })
    },
    editTema: (formData) => {
        return axios({
            method: "post",
            url: "/system/editTema",
            data: formData
        })
    },
    deleteTema: (id) => {
        return axios({
            method: "get",
            url: `/system/deleteTema/${id}`,
        })
    },
}