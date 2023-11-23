import config from "./config";



const visitors = () => {
  return config.getAxios().get(config.urls().baseUrl + "visitor/list");
};

const editVisitor = (entity) => {
  return config.getAxios().post(config.urls().baseUrl + "visitor/update", 
      entity
    )
    .then((response) => {
      return response.data;
    });
    
};

const createVisitor = (entity) => {
  return config.getAxios().post(config.urls().baseUrl + "visitor/create", 
      entity
    )
    .then((response) => {
      return response.data;
    });
    
};


const visitorServices = {
  visitors,
  editVisitor,
  createVisitor
}



export default visitorServices;