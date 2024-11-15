import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Toast } from 'primereact/toast';
import { Chip } from "primereact/chip";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Card } from 'primereact/card';

import endPoint from "./services/endPoint";
import config from "./services/config";

import Utils from "./services/Utils";

import Home from "./components/user/Home";
import Login from "./components/user/Login";


import Dashboard from "./components/general/Dashboard";
import HealthRecored from "./components/general/HealthRecored";
import Payment from "./components/general/Payment";


import Users from "./components/user/Users";
import ViewUser from "./components/user/ViewUser";
import AddUser from "./components/user/AddUser";

import AddPatient from "./components/patient/AddPatient";
import PatientTreatments from "./components/patient/PatientTreatments";
import ViewPatientTreatment from "./components/patient/ViewPatientTreatment";
import AddPatientTreatment from "./components/patient/AddPatientTreatment";
import PatientProfile from "./components/patient/PatientProfile";


import DoctorAddPatientTreatment from "./components/doctor/DoctorAddPatientTreatment";
import DoctorProfile from "./components/doctor/DoctorProfile";
import DoctorPatientTreatments from "./components/doctor/DoctorPatientTreatments";
import DoctorViewPatientTreatment from "./components/doctor/DoctorViewPatientTreatment";
import TestPatient from "./components/doctor/TestPatient";


import AddTreatment from "./components/treatment/AddTreatment";
import ViewTreatment from "./components/treatment/ViewTreatment";
import Treatments from "./components/treatment/Treatments";


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
  const op = useRef(null);

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")));
    EventBus.on("handelUserLogged", (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      setCurrentUser(data);

    });

    EventBus.on("handelHttpError", (error) => {

      console.log("------------------------0000000 ", error);
      if (error.response === undefined) {
        error = {
          message: 'Refused Connection',
          response: {
            status: 500
          }
        }
      }
      const resMessage = (error.response &&
        error.response.data &&
        error.response.data.message) ||
        error.message || error.toString();
      toast.current.show({ severity: 'error', summary: 'Error', detail: resMessage, life: 6000 });

      if (error.response.status == 401 || error.response.status == 403) {
        setTimeout(() => {

          document.cookie = "";
          setCurrentUser(null);
          localStorage.removeItem("user");
          load('/lcd/app/home');
        }, "1000");

      }
    });
  }, []);


  const isLogged = () => {
    return currentUser !== null && currentUser !== undefined;

  }


  const logOut = () => {
    endPoint(config.userAPIs.logout, "GET", null).then((res) => { });
    document.cookie = "";
    setCurrentUser(null);
    localStorage.removeItem("user");
    load('/lcd/app/home');
  };



  const items = [

    {
      label: 'Healthcare',
      icon: 'pi pi-fw pi-home',
      items: [
        {
          label: 'Treatments',
          icon: 'pi pi-fw pi-list',
          command: () => {
            navigate("/lcd/app/treatments");
          },
        }
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
      label: 'Settings',
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



  const startContent = (
    <React.Fragment>
      {<Menubar model={items} />}
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEYElEQVR4nNVZ3W8iVRSfF9347INuNDEmxjWuf4WJr8aNiWZ98sGv6K4+aKJvGp/V7v4bNWnScs4AsymlX/SLdtttoXSgLdCW0qVQZoChQOWaMzsosEA7dy6we5NfMhnmnvv73XPuveceJElAA4BXEfEzRLwPAF4AiCJiDgCqBOs5Sr9Z39ymPtIw29jY2MsA8D0ArCAi4wEALAPAXbI1MOKyLL8OAPcQscRLvIOQIgCMuFyu1/pGPBgMvoCIPwBAQRRxfBo0Kb/JsnxNKHm3230DEdf7SJy14SEivi2EPCJ+3OdZZ12gu1yuW47IA8DnAFAbAnlm4QIRv+El//UQibNm0E5lO2ws9UMnj/974qMrkfd4PG8BgPYMkGZtXihMTEy805P86Ojoi6J2G4/Hw/z+aRP0LEjEGm3nveL+FycDKA8esPBOlJ3mC8yosRZkznQWiqjmNw5F/NSRPJ2CdCLyGt7YDDG9XHuKeDsK5Rp7uLHpKJTcbvf1TrN/j9dobD9xKfF2UB/kF/FnC3lKpnhzm3BEtU2+ga1whFdAsSUBpKySx5B/eoaVqnVuAaVqnU3PzPJ64rtmAVwp8UHqhJt8A8mjNK+AJZM8LQgAqNs14FUUR7Pf7AWvovCEUX18fPwVybpJ2TawHFx1TN6wsLQS5PXCpyTgPk/nR1thYQI2NkO8i3lEsu6ptjuHtneECQht7/AKkMkDuzyd6TASJWBt/RGvgCh5IMvTeT6wIEzA3HyAdw1kyAMVns6yLDOtVHFMXitVTFucHjjnFkCgxM1x/EdU3tl/IoA3hAher5fli+fc5M8KZdMG7/hmCAFAzIEBNjM7xwrnF7bJFyv/sNm5eSfk/1vEXNtoMwILi0w3qrbinvqgw3Eb2yjXQdaOyUkfix+kLiW/nzxikz6f4/Gw6SC7LcJYA1NTfrYZ2jaTtPTpmQl6pnc+35SwcfCJgE8kSoh4krlhAxrJnJVOLz+HAhaa7wN3n0MB37ZcKZ1c6LuB8nyeXB/tXiktL4w4IbqyumZe1I8zuY5bKr2j3+gb+taJMAD4Q0hZZWFxiSUOj7luZtQncXhs2rApQO/69xQA/HwVI3SC0myKykZPsnkzu72igB+lbo3KdlS+69aZSoS78aQw4kYbKLwuKUOu9iwt9iru0gF1qhX7Rt6wQGPQWF0qcjd6km9aD7eay+sUMiJyfzu50mxronfhcrk+vBL5pvXwlTnz/mlbiZoo6OWaWfSysoQvJJ6mKMqXOd0YOHnDQlYrMUVR7khOmhrb+1U3qvVBk9eMan1nd/93SUQLh9UPHue04qDIn2TzxUgk9r4ksqmqei1+kBqnmelb3BvV+m78wBsIBF6S+tXCsdh7yVR6VS/XhAnRjGo9mUoHt1T1XWlQbXF9/c395NHfJzlN500l0tm8vpc4HA2FQm8MjHinRl6J7sVHEkfHa+lMLpPVSxWtVKnTxZ1Az/Qunck9Ju9F9+J/RROJmyIG/xfCWpgNDDFCCwAAAABJRU5ErkJggg=="
        style={{ cursor: 'pointer' }}
        onClick={(e) => op.current.toggle(e)} />
      <OverlayPanel ref={op}>

        <Card
          title={<div>
            <i className="pi pi-user" style={{ fontSize: '2.5rem' }}></i>
            &nbsp;&nbsp;{currentUser?.fullName}</div>}
          subTitle={currentUser?.email}
          footer={<div><Button label="Logout" onClick={(e) => { logOut(); }}
            severity="secondary" icon="pi pi-fw pi-power-off" style={{ marginLeft: '0.5em' }} />
          </div>}
          header={<div></div>}
          className="md:w-25rem"
          style={{ boxShadow: 'none' }}>

          <p className="m-0">
            {currentUser?.mobileNumber}
          </p>

        </Card>


      </OverlayPanel>


    </React.Fragment>
  );

  const load = (url) => {
    if (isLogged) {
      navigate(url);
    }
  }
  return (
    <div>
      <Toast ref={toast} />
      {isLogged()
        && currentUser?.type?.value !== 'PATIENT'
        && currentUser?.type?.value !== 'DOCTOR'
        && <Toolbar style={{ height: '55px', backgroundColor: '#A855F7' }} start={startContent} end={endContent} />}
      <div className="container mt-3">
        <Routes>
          <Route exact path={"/lcd/"} element={<Home />} />
          <Route exact path={"/lcd/app"} element={<Home />} />
          <Route exact path={"/lcd/app/home"} element={<Home />} />

          <Route exact path={"/lcd/app/login"} element={<Login />} />

          <Route exact path={"/lcd/app/dashboard"} element={<Dashboard />} />
          <Route exact path={"/lcd/app/healthRecored"} element={<HealthRecored />} />
          <Route exact path={"/lcd/app/payment"} element={<Payment />} />



          <Route exact path={"/lcd/app/users"} element={<Users />} />
          <Route exact path={"/lcd/app/viewUser"} element={<ViewUser />} />
          <Route exact path={"/lcd/app/addUser"} element={<AddUser />} />

          <Route exact path={"/lcd/app/addPatient"} element={<AddPatient />} />
          <Route exact path={"/lcd/app/patientTreatments"} element={<PatientTreatments />} />
          <Route exact path={"/lcd/app/viewPatientTreatment"} element={<ViewPatientTreatment />} />
          <Route exact path={"/lcd/app/addPatientTreatment"} element={<AddPatientTreatment />} />
          <Route exact path={"/lcd/app/patientProfile"} element={<PatientProfile />} />


          <Route exact path={"/lcd/app/doctorProfile"} element={<DoctorProfile />} />
          <Route exact path={"/lcd/app/doctorViewPatientTreatment"} element={<DoctorViewPatientTreatment />} />
          <Route exact path={"/lcd/app/doctorAddPatientTreatment"} element={<DoctorAddPatientTreatment />} />
          <Route exact path={"/lcd/app/doctorPatientTreatments"} element={<DoctorPatientTreatments />} />
          <Route exact path={"/lcd/app/testPatient"} element={<TestPatient />} />
          

          <Route exact path={"/lcd/app/addTreatment"} element={<AddTreatment />} />
          <Route exact path={"/lcd/app/viewTreatment"} element={<ViewTreatment />} />
          <Route exact path={"/lcd/app/treatments"} element={<Treatments />} />

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
