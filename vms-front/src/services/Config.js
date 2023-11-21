import axios from "axios";

const urls = () => {
    return {baseUrl: "http://localhost:8088/vms/"}
};

const visitors = () => {
  return axios.get(urls().baseUrl + "visitor/list");
};

const editVisitor = (entity) => {
  return axios.post(urls().baseUrl + "visitor/update", 
      entity
    )
    .then((response) => {
      return response.data;
    });
    
};

const config = {
  urls,
  visitors,
  editVisitor
}



export default config;