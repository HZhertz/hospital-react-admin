import login from "./component/login"
import tema from "./component/tema"
import doctor from "./component/doctor"
import register from "./component/register"
import announcement from "./component/announcement"
import hospitalAnnouncement from "./component/hospitalAnnouncement"
import rotograph from "./component/rotograph"
import medicalTreatment from "./component/medicalTreatment"

const api = {
    ...login,
    ...tema,
    ...doctor,
    ...register,
    ...announcement,
    ...hospitalAnnouncement,
    ...rotograph,
    ...medicalTreatment
}
export default api