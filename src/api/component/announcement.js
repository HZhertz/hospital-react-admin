import axios from "../../untils/axios"
export default {
    getSystemAnnouncement: (params) => {
        return axios({
            method: "get",
            url: "/system/getSystemAnnouncement",
            params
        })
    },
    addAnnouncementImage: (formData) => {
        return axios({
            method: "post",
            url: "/system/addAnnouncementImage",
            data: formData
        })
    },
    addSystemAnnouncement: (formData) => {
        return axios({
            method: "post",
            url: "/system/addSystemAnnouncement",
            data: formData
        })
    },
    updateSystemAnnouncement: (formData) => {
        return axios({
            method: "post",
            url: "/system/updateSystemAnnouncement",
            data: formData
        })
    },
    deleteSystemAnnouncement: (id) => {
        return axios({
            method: "get",
            url: `/system/deleteSystemAnnouncement/${id}`,
        })
    },
}