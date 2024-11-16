import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { SpeedDial } from "primereact/speeddial";
import { Chip } from "primereact/chip";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Show } from "./../../custom/Show";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Utils from "./../../services/Utils";



const Aside = () => {

    Utils.customBackGround(false);

    const navigate = useNavigate();
    const location = useLocation();

    const [route, setRoute] = useState(location.pathname);
    console.log(location.pathname);


    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading) {
            setCurrentUser(JSON.parse(localStorage.getItem("user")));

            console.log(currentUser);


            setLoading(true);
        }
    });

    const logOut = () => {
        endPoint(config.userAPIs.logout, "GET", null).then((res) => { });
        document.cookie = "";
        localStorage.removeItem("user");
        navigate('/lcd/app/home');
    };




    return (
        <div >


            <div class="sidebar">
                <div class="company-name">Liver Cancer</div>
                <div class="sidebar-inner">
                    <nav>
                        {currentUser.type?.value === 'DOCTOR' &&
                            <Link to="/lcd/app/doctorProfile" class={route.endsWith("/doctorProfile") ? "active" : ""}><i class="fas fa-user-circle"></i> View Profile</Link>
                            ||
                            <Link to="/lcd/app/patientProfile" class={route.endsWith("/patientProfile") ? "active" : ""}><i class="fas fa-user-circle"></i> View Profile</Link>

                        }

                        {currentUser.type?.value === 'DOCTOR' &&
                            <Link to="/lcd/app/doctorPatientTreatments" class={route.endsWith("/doctorPatientTreatments") ? "active" : ""}> <i class="fas fa-calendar-check"></i> View Appointments</Link>
                            ||
                            <Link to="/lcd/app/patientTreatments" class={route.endsWith("/patientTreatments") ? "active" : ""}> <i class="fas fa-calendar-check"></i> View Appointments</Link>

                        }


                        {currentUser.type?.value === 'DOCTOR' &&
                            <Link to="/lcd/app/doctorAddPatientTreatment" class={route.endsWith("/doctorAddPatientTreatment") ? "active" : ""}><i class="fas fa-calendar-plus"></i> Book Appointment</Link>
                            ||
                            <Link to="/lcd/app/addPatientTreatment" class={route.endsWith("/addPatientTreatment") ? "active" : ""}><i class="fas fa-calendar-plus"></i> Book Appointment</Link>

                        }
                        {currentUser.type?.value === 'DOCTOR' &&
                            <Link to="/lcd/app/testPatient" class={route.endsWith("/testPatient") ? "active" : ""}> <i class="fas fa-heartbeat"></i>Cancer Detection</Link>
                        }
                         {currentUser.type?.value === 'DOCTOR' &&
                            <Link to="/lcd/app/modifyPatientDetails" class={route.endsWith("/modifyPatientDetails") ? "active" : ""}> <i class="fas fa-user-edit"></i> Modify patient-details</Link>
                        }


                        <Link to="/lcd/app/dashboard" class={route.endsWith("/dashboard") ? "active" : ""}><i class="fas fa-chart-line"></i> Dashboard</Link>
                        {currentUser.type?.value !== 'DOCTOR' && <Link to="/lcd/app/payment" class={route.endsWith("/payment") ? "active" : ""}><i class="fas fa-credit-card"></i> Payment</Link>}
                        <Link to="/lcd/app/healthRecored" class={route.endsWith("/healthRecored") ? "active" : ""}><i class="fas fa-file-medical"></i> Health Records</Link>
                        <Link to="#" ><i class="fas fa-headset" ></i> Support</Link>
                        <a href="#" onClick={(e) => { logOut(); }}><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </nav>
                </div>
            </div>
        </div>

    );
};

export default Aside;
