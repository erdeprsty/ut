import axios from "axios";
import { config } from "../constants";
axios.defaults.baseURL = config.BASE_URL;
axios.defaults.validateStatus = (status) => {
    return status >= 200 && status < 400;
};
export default axios;
