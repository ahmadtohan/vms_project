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
import Aside from './../general/Aside'
import './../../css/AllDoctor.css'
import './../../css/patientProfile.css'
import './../../css/addPatientTreatment.css'
const DoctorViewPatientTreatment = () => {

    const navigate = useNavigate();
    const id = new URLSearchParams(window.location.search).get("id");
    const [treatment, setTreatment] = useState({
        status: {},
        type: {},
        doctor: {},
        patient: {},
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!loading) {
            endPoint(config.treatmentAPIs.getdoctorpatienttreatment + "/" + id, "GET", null).then(
                (res) => {
                    setTreatment(res);
                },
                (error) => { }
            );

            setLoading(true);
        }

    });


    return (
        <div >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-doctor-css use-profile-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />

                        <div class="content">
                            <div class="content-header">
                                <div class="header">
                                    <h1>View Appointment</h1>
                                    <div class="content-subheader"> Mange Appointment</div>

                                </div>
                            </div>


                            <div class="patient-info">
                                <img src="https://cdn2.stylecraze.com/wp-content/uploads/2013/07/Beautiful-Russian-Women.jpg.avif" alt="Mrs. Maria Waston" />
                                <div class="patient-details">
                                    <div>
                                        <strong>Patient</strong>
                                        {treatment.patient?.fullName}
                                    </div>

                                    <div>
                                        <strong>Type</strong>
                                        {treatment.type?.label}
                                    </div>

                                    <div>
                                        <strong>Status</strong>
                                        {treatment.status?.label}
                                    </div>



                                    <div>
                                        <strong>Appointment Date</strong>
                                        {treatment.appointmentDate}
                                    </div>

                                    <div style={{ width: '250%' }}>
                                        <strong>description</strong>
                                        {treatment.description}
                                    </div>
                                </div>
                            </div>


                            <div class=" use-add-patient-treatment-css action-buttons">
                                <button type="button" class="btn btn-secondary" onClick={(e) => { window.history.go(-1); return false; }}>Back</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorViewPatientTreatment;
