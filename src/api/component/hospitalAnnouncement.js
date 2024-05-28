import axios from "../../untils/axios"
export default {
    getSystemHospitalAnnouncement: (params) => {
        return axios({
            method: "get",
            url: "/system/getSystemHospitalAnnouncement",
            params
        })
    },
    addSystemHospitalAnnouncementImage: (formData) => {
        return axios({
            method: "post",
            url: "/system/addSystemHospitalAnnouncementImage",
            data: formData
        })
    },
    addSystemHospitalAnnouncement: (formData) => {
        return axios({
            method: "post",
            url: "/system/addSystemHospitalAnnouncement",
            data: formData
        })
    },
    editSystemHospitalAnnouncement: (formData) => {
        return axios({
            method: "post",
            url: "/system/editSystemHospitalAnnouncement",
            data: formData
        })
    },
    deleteSystemHospitalAnnouncement: (id) => {
        return axios({
            method: "get",
            url: `/system/deleteSystemHospitalAnnouncement/${id}`,
        })
    },
    setSystemHospitalAnnouncementRecommend: (params) => {
        return axios({
            method: "get",
            url: `/system/setSystemHospitalAnnouncementRecommend`,
            params
        })
    },
}