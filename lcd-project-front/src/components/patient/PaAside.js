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
import { useNavigate, useLocation } from "react-router-dom";



const PaAside = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [route, setRoute] = useState(location.pathname);
    console.log(location.pathname);

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
                        <a href="/lcd/app/patientProfile" class={route.endsWith("/patientProfile") ? "active" : ""}><i class="fas fa-user-circle"></i> View Profile</a>
                        <a href="/lcd/app/patientTreatments" class={route.endsWith("/patientTreatments") ? "active" : ""}> <i class="fas fa-calendar-check"></i> View Appointments</a>
                        <a href="/lcd/app/addPatientTreatment" class={route.endsWith("/addPatientTreatment") ? "active" : ""}><i class="fas fa-calendar-plus"></i> Book Appointment</a>
                        <a href="#"><i class="fas fa-chart-line"></i> Dashboard</a>
                        <a href="PaymentPage.html"><i class="fas fa-credit-card"></i> Payment</a>
                        <a href="healthRecored.html"><i class="fas fa-file-medical"></i> Health Records</a>
                        <a href="#"><i class="fas fa-headset"></i> Support</a>
                        <a onClick={(e) => { logOut(); }}><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </nav>
                </div>
            </div>
        </div>

    );
};

export default PaAside;
