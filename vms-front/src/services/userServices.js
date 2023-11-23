import config from "./config";


const users = () => {
  return config.getAxios().get(config.urls().baseUrl + "user/list");
};
const login = (entity) => {
  return config.getAxios(true).post(config.urls().baseUrl + "user/login", 
      entity
    )
    .then((response) => {
      return response.data;
    });
    
};

const editUser = (entity) => {
  return config.getAxios().post(config.urls().baseUrl + "user/update", 
      entity
    )
    .then((response) => {
      return response.data;
    });
    
};

const createUser = (entity) => {
  return config.getAxios().post(config.urls().baseUrl + "user/create", 
      entity
    )
    .then((response) => {
      return response.data;
    });
    
};


const userServices = {
  users,
  login,
  editUser,
  createUser
}



export default userServices;