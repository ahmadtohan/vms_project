import axios from "axios";

const urls = () => {
    return {baseUrl: "http://localhost:8088/vms/"}
};


const config = {
  urls,
  axios
}



export default config;