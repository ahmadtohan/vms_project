import React, { useState, useEffect ,useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
 import { Toast } from 'primereact/toast';


import Visitors from "./components/vms/Visitors";
import AddVisitor from "./components/vms/AddVisitor";
import Login from "./components/user/Login";

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
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
           const resMessage =(error.response &&
                             error.response.data &&
                             error.response.data.message) ||
                             error.message || error.toString();
                toast.current.show({severity: 'warn', summary: 'Rejected', detail: resMessage , life: 6000});

if(error.response.status==401 || error.response.status==403 ){
      setTimeout(() => {

                            window.location.href = '/vms/app/login';
                            }, "1000");

 }
    });
  }, []);



const logOut = () => {
setCurrentUser(null);
     localStorage.removeItem("user");
    load('/vms/app/login');
  };

    const startContent = (
        <React.Fragment>
          { (currentUser!==null && currentUser !== undefined) && <Button label="Visitors" icon="pi pi-home" severity="help" className="mr-2" onClick={(e) => load('/vms/app/visitors')} text />}

        </React.Fragment>
    );

    const endContent = (
        <React.Fragment>
                 <Button label="Logout" severity="danger" className="mr-2" onClick={(e) => logOut()} text />

        </React.Fragment>
    );
    
     const load = (url) => {
                 if(currentUser==null || currentUser === undefined){
                    return;
                 }

                 navigate(url);
     }
  return (
    <div>
     <Toast ref={toast} />
      <Toolbar start={startContent} end={endContent}  />
      <div className="container mt-3">
        <Routes>
          <Route exact path={"/vms/"} element={<Visitors />} />
          <Route exact path={"/vms/app/"} element={<Visitors />} />
          <Route exact path={"/vms/app/login"} element={<Login />} />
          
          <Route exact path={"/vms/app/visitors"} element={<Visitors />} />
          <Route exact path={"/vms/app/addVisitor"} element={<AddVisitor />} />
        </Routes>
      </div>

    
    </div>
  );
};

export default App;
