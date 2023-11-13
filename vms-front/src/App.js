import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import Test from "./components/test";
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
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };


    const startContent = (
        <React.Fragment>
            <Button label="Home" icon="pi pi-home" severity="help" className="mr-2" onClick={(e) => load('/home')} text />
            <Button label="Test" icon="pi pi-book" className="mr-2" onClick={(e) => load('/test')} text />
           {showModeratorBoard && ( <Button label="Mod" icon="pi pi-home" className="mr-2" onClick={(e) => load('/mod')} text />)}
           {showAdminBoard && ( <Button label="Admin" icon="pi pi-home" className="mr-2" onClick={(e) => load('/admin')} text />)}
           {currentUser && ( <Button label="User" icon="pi pi-lock" className="mr-2" onClick={(e) => load('/user')} text />)}
           

        </React.Fragment>
    );

    const endContent = (
        <React.Fragment>
        {currentUser && ( <Button label={currentUser.username} icon="pi pi-user" className="mr-2" onClick={(e) => load('/profile')} text />)}
        <Button label="Login" icon="pi pi-user" className="p-button-success mr-2" onClick={(e) => load('/login')} text />
        <Button label="Register" icon="pi pi-plus" className="mr-2" onClick={(e) => load('/register')} text />
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
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/home"} element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
           <Route path="/test" element={<Test />} />
        </Routes>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
