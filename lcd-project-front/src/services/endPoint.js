import axios from "axios";
import config from "./config"
import EventBus from "./../common/eventBus";


export default function endPoint(api, method, body) {
  console.log("----endPoint-------", api, method, body);
  if (api !== config.userAPIs.login) {
    var sessionUser = JSON.parse(localStorage.getItem("user"));
    if (sessionUser == null || sessionUser === undefined) {
      sessionUser = { token: "" };
    }
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionUser.token;
  } else {
    axios.defaults.headers.common['Authorization'] = "";
  }
  axios.defaults.withCredentials = true;
  if (method.toUpperCase() === 'DELETE') {

    return axios.delete(config.baseUrl + api)
      .then((response) => {

        return response.data;
      }).catch((error) => {
        console.log({ ...error })
        EventBus.dispatch("handelHttpError", { ...error });

        throw { ...error };
      });

  }else if (method.toUpperCase() === 'GET') {

    return axios.get(config.baseUrl + api)
      .then((response) => {

        return response.data;
      }).catch((error) => {
        console.log({ ...error })
        EventBus.dispatch("handelHttpError", { ...error });

        throw { ...error };
      });

  }
  else if (method.toUpperCase() === 'POST') {
    return axios.post(config.baseUrl + api, body)
      .then((response) => {

        console.log("ok: ", response);
        return response.data;
      }).catch((error) => {
        console.log({ ...error })
        EventBus.dispatch("handelHttpError", { ...error });

        throw { ...error };
      });

  }

};






