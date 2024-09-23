import React, { useState, useEffect ,useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
 import { Toast } from 'primereact/toast';

import endPoint from "./services/endPoint";
import config from "./services/config";


import Login from "./components/user/Login";

import Users from "./components/user/Users";
import ViewUser from "./components/user/ViewUser";
import AddUser from "./components/user/AddUser";

import Roles from "./components/role/Roles";
import ViewRole from "./components/role/ViewRole";
import AddRole from "./components/role/AddRole";

import Permissions from "./components/permission/Permissions";


import Parameters from "./components/core/parameter/Parameters";
import Picklists from "./components/core/picklist/Picklists";

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { SplitButton } from 'primereact/splitbutton';
 import { useNavigate } from "react-router-dom";
 import EventBus from "./common/eventBus";



const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
        const toast = useRef(null);

  useEffect(() => {
 setCurrentUser(JSON.parse(localStorage.getItem("user")));

EventBus.on("handelUserLogged", (data) => {
  localStorage.setItem("user", JSON.stringify(data));
   setCurrentUser(data);

});

 EventBus.on("handelHttpError", (error) => {

      console.log("------------------------0000000 ",error);
      if(error.response ===undefined){
      error ={
      message:'Refused Connection',
      response: {
      status:500
             }
           }
      }
           const resMessage =(error.response &&
                             error.response.data &&
                             error.response.data.message) ||
                             error.message || error.toString();
                toast.current.show({severity: 'error', summary: 'Error', detail: resMessage , life: 6000});

if(error.response.status==401 || error.response.status==403 ){
      setTimeout(() => {

                            window.location.href = '/lcd/app/login';
                            }, "1000");

 }
    });
  }, []);


const isLogged = () => {
 return currentUser!==null && currentUser !== undefined;

}


const logOut = () => {
 endPoint(config.userAPIs.logout, "GET",null).then((res) => {});
  document.cookie="";
setCurrentUser(null);
    localStorage.removeItem("user");
    load('/lcd/app/login');
  };



    const items = [

            {
                label: 'Users & Roles',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        command: () => {
                                    navigate("/lcd/app/users");
                                 },
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-user',
                             command: () => {
                                         navigate("/lcd/app/roles");
                                  }

                    },
                    {
                        label: 'Permission',
                        icon: 'pi pi-fw pi-lock',
                      command: () => {
                                         navigate("/lcd/app/permissions");
                                  }
                    }
                ]
            },
            {
                label: 'System',
                icon: 'pi pi-fw pi-chevron-circle-down',
                items: [
                    {
                        label: 'Parameters',
                        icon: 'pi pi-fw pi-circle-fill',
                         command: () => {
                           navigate("/lcd/app/Parameters");
                                    }
                    },
                    {
                                            label: 'Picklist',
                                            icon: 'pi pi-fw pi-circle-fill',
                                             command: () => {
                            navigate("/lcd/app/Picklists");
                                                        }
                                        },
                ]
            },

        ];

 const lastItems = [
  {
                 label: 'Logout',
                 icon: 'pi pi-fw pi-power-off',
                  command: () => {
                                logOut();
                      }
        }
 ]

  const startContent = (
        <React.Fragment>
        <Menubar model={items} />
        </React.Fragment>
    );

    const endContent = (
        <React.Fragment>
          <Menubar model={lastItems} />

        </React.Fragment>
    );

     const load = (url) => {
                if(isLogged){
                 navigate(url);
                 }
     }
  return (
    <div>
     <Toast ref={toast} />
      { isLogged() &&   <Toolbar  style={{height:'50px'}}   start={startContent} end={endContent}  />}
      <div className="container mt-3">
        <Routes>
          <Route exact path={"/lcd/"} element={<Login />} />
          <Route exact path={"/lcd/app/"} element={<Login />} />
          <Route exact path={"/lcd/app/login"} element={<Login />} />

             <Route exact path={"/lcd/app/users"} element={<Users />} />
             <Route exact path={"/lcd/app/viewUser"} element={<ViewUser />} />
             <Route exact path={"/lcd/app/addUser"} element={<AddUser />} />

              <Route exact path={"/lcd/app/roles"} element={<Roles />} />
             <Route exact path={"/lcd/app/viewRole"} element={<ViewRole />} />
             <Route exact path={"/lcd/app/addRole"} element={<AddRole />} />

                <Route exact path={"/lcd/app/permissions"} element={<Permissions />} />

            <Route exact path={"/lcd/app/Parameters"} element={<Parameters />} />
            <Route exact path={"/lcd/app/Picklists"} element={<Picklists />} />


        </Routes>
      </div>

    
    </div>
  );
};

export default App;
