import axios from "axios";
 import { useNavigate } from "react-router-dom";
 

  
const urls = () => {
    return {baseUrl: "http://localhost:8088/vms/"}
};


const getAxios = (noAuth) => {
    console.log("noAuth: "+noAuth)
    
    if(noAuth!=true){
        var sessionUser=JSON.parse(localStorage.getItem("user"));
        if(sessionUser==null || sessionUser === undefined){
           //  navigate("/vms/app/login");
            return;
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer '+JSON.parse(localStorage.getItem("user")).token;
    }
   
    return axios
};

const config = {
  urls,
  getAxios
}



export default config;