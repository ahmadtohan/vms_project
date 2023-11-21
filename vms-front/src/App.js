import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


import Visitor from "./components/Visitor";

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
 import { useNavigate } from "react-router-dom";
 
// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  useEffect(() => {


  }, []);


    const startContent = (
        <React.Fragment>
            <Button label="Visitors" icon="pi pi-home" severity="help" className="mr-2" onClick={(e) => load('/visitor')} text />
         
       
           

        </React.Fragment>
    );

    const endContent = (
        <React.Fragment>
    
        </React.Fragment>
    );
    
     const load = (url) => {
                 navigate(url);
     }
  return (
    <div>
      <Toolbar start={startContent} end={endContent}  />
      <div className="container mt-3">
        <Routes>
          <Route exact path={"/"} element={<Visitor />} />
          <Route exact path={"/visitor"} element={<Visitor />} />
        </Routes>
      </div>

    
    </div>
  );
};

export default App;
