import axios from "../../untils/axios"
export default {
    getUserMedicalTreatment: () => {
        return axios({
            method: "get",
            url: "/medicalTreatment/getUserMedicalTreatment",
        })
    },
    getMedicalTreatment: (params) => {
        return axios({
            method: "get",
            url: "/medicalTreatment/getMedicalTreatment",
            params
        })
    },
}