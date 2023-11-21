import axios from "axios";

const urls = () => {
    return {baseUrl: "http://localhost:8088/vms/"}
};

const visitors = () => {
  return axios.get(urls().baseUrl + "visitor/list");
};

const config = {
  urls,
  visitors
}



export default config;