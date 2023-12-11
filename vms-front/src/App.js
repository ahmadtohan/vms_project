import React, { useState, useEffect ,useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
 import { Toast } from 'primereact/toast';

import endPoint from "./services/endPoint";
import config from "./services/config";

import Visitors from "./components/visitor/Visitors";
import AddVisitor from "./components/visitor/AddVisitor";
import VerifyVisitor from "./components/visitor/VerifyVisitor";
import ViewVisitor from "./components/visitor/ViewVisitor";
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

                            window.location.href = '/vms/app/login';
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
    load('/vms/app/login');
  };



    const items = [
            {
                label: 'Visitors',
                icon: 'pi pi-fw pi-id-card',
                 command: () => {
                                    navigate("/vms/app/visitors");
                                 },
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-align-left',
                         command: () => {
                                navigate("/vms/app/");
                              }
                    },

                    {
                        label: 'Verify',
                        icon: 'pi pi-fw pi-check'
                    },
                    {
                        label: 'Justify',
                        icon: 'pi pi-fw pi-align-justify'
                    },

                ]
            },
            {
                label: 'Users & Roles',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        command: () => {
                                    navigate("/vms/app/users");
                                 },
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-user',
                             command: () => {
                                         navigate("/vms/app/roles");
                                  }

                    },
                    {
                        label: 'Permission',
                        icon: 'pi pi-fw pi-lock',
                      command: () => {
                                         navigate("/vms/app/permissions");
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
                           navigate("/vms/app/Parameters");
                                    }
                    },
                    {
                                            label: 'Picklist',
                                            icon: 'pi pi-fw pi-circle-fill',
                                             command: () => {
                            navigate("/vms/app/Picklists");
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
          <Route exact path={"/vms/"} element={<Login />} />
          <Route exact path={"/vms/app/"} element={<Login />} />
          <Route exact path={"/vms/app/login"} element={<Login />} />

             <Route exact path={"/vms/app/users"} element={<Users />} />
             <Route exact path={"/vms/app/viewUser"} element={<ViewUser />} />
             <Route exact path={"/vms/app/addUser"} element={<AddUser />} />

              <Route exact path={"/vms/app/roles"} element={<Roles />} />
             <Route exact path={"/vms/app/viewRole"} element={<ViewRole />} />
             <Route exact path={"/vms/app/addRole"} element={<AddRole />} />

                <Route exact path={"/vms/app/permissions"} element={<Permissions />} />

            <Route exact path={"/vms/app/Parameters"} element={<Parameters />} />
 <Route exact path={"/vms/app/Picklists"} element={<Picklists />} />

           <Route exact path={"/vms/app/verifyVisitor"} element={<VerifyVisitor />} />
          <Route exact path={"/vms/app/visitors"} element={<Visitors />} />
          <Route exact path={"/vms/app/addVisitor"} element={<AddVisitor />} />
           <Route exact path={"/vms/app/viewVisitor"} element={<ViewVisitor />} />


        </Routes>
      </div>

    
    </div>
  );
};

export default App;
