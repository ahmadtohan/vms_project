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
import { useNavigate } from "react-router-dom";
import PaAside from './PaAside'
import './../../css/All.css'
import './../../css/patientTreatments.css'
const PatientTreatments = () => {

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem("user")));

        console.log(currentUser);
    });


    return (
        <div >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-css use-patient-treatments-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <PaAside />

                        <div class="main-content">
                            <div class="content-header">
                                <h1>Your Appointments</h1>
                                <div class="content-subheader">Manage your upcoming doctor appointments</div>
                            </div>

                            <div class="appointments-container" id="appointmentsContainer">

                                <div class="card">
                                    <div class="doctor-info">
                                        <div class="doctor-avatar">
                                            <i class="fas fa-user-md"></i>
                                        </div>
                                        <div class="doctor-details">
                                            <div class="doctor-name">Dr. Sarah Johnson</div>
                                            <div class="doctor-specialty">Oncologist</div>
                                        </div>
                                    </div>
                                    <div class="appointment-info">
                                        <div class="time-location">
                                            <div class="appointment-time">
                                                <i class="far fa-clock"></i>
                                                Oct 23, 2024 - 10:30 AM
                                            </div>
                                            <div class="appointment-location">
                                                <i class="fas fa-map-marker-alt"></i>
                                                Memorial Hospital, Room 302
                                            </div>
                                        </div>
                                        <span class="status-badge status-confirmed">Confirmed</span>
                                    </div>
                                    <div class="card-actions">
                                        <button class="btn btn-primary">

                                            View Details
                                        </button>
                                        <button class="btn btn-secondary">
                                            <i class="fas fa-pencil-alt"></i>
                                            Reschedule
                                        </button>
                                    </div>
                                </div>



                            </div>
                        </div>

                        <button class="fab" id="addAppointment" onClick={(e) => { navigate('/lcd/app/AddPatientTreatment') }}>
                            <i class="fas fa-plus"></i>
                        </button>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default PatientTreatments;
