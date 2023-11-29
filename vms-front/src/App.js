import React, { useState, useEffect ,useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
 import { Toast } from 'primereact/toast';


import Visitors from "./components/visitor/Visitors";
import AddVisitor from "./components/visitor/AddVisitor";
import VerifyVisitor from "./components/visitor/VerifyVisitor";
import ViewVisitor from "./components/visitor/ViewVisitor";
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
setCurrentUser(null);
    localStorage.removeItem("user");
    load('/vms/app/login');
  };

    const startContent = (
        <React.Fragment>
          <Button label="Visitors" icon="pi pi-home" style={{color:'white'}} className="mr-2" onClick={(e) => load('/vms/app/visitors')} text />

        </React.Fragment>
    );

    const endContent = (
        <React.Fragment>
         <Button label="Logout" style={{color:'white'}} className="mr-2" onClick={(e) => logOut()} text />

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
      { isLogged() && <Toolbar  style={{background: '#A855F7'}} start={startContent} end={endContent}  />}
      <div className="container mt-3">
        <Routes>
          <Route exact path={"/vms/"} element={<Login />} />
          <Route exact path={"/vms/app/"} element={<Login />} />
          <Route exact path={"/vms/app/login"} element={<Login />} />
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
