import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { SpeedDial } from "primereact/speeddial";
import { Chip } from "primereact/chip";
import Utils from "./../../services/Utils";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Show } from "./../../custom/Show";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import PaAside from './PaAside'
import './../../css/All.css'
import './../../css/addPatientTreatment.css'
const AddPatientTreatment = () => {

    const toast = useRef(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const [avlTimes, setAvlTimes] = useState({});
    const [avlDates, setAvlDates] = useState([]);

    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState({});

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!loading) {
            endPoint(
                config.userAPIs.getusers + "?type=DOCTOR",
                "GET",
                null
            ).then((res) => {
                console.log(res);
                setDoctors(res);
            }
            );

            endPoint(
                config.picklistAPIs.getbycode + "?code=avl_times",
                "GET",
                null
            ).then((res) => {
                console.log(res);
                setAvlTimes(res);
            }
            );

            setAvlDates(getNextFourWeekdays());
            setLoading(true);
        }

    });

    function getNextFourWeekdays() {
        const weekdays = [];
        const today = new Date();

        // Start from tomorrow
        today.setDate(today.getDate() + 1);

        while (weekdays.length < 4) {
            // Check if the day is a weekday (Monday to Friday)
            if (today.getDay() !== 0 && today.getDay() !== 6) {
                weekdays.push(Utils.formatDateWithoutTime(new Date(today)));
            }
            // Move to the next day
            today.setDate(today.getDate() + 1);
        }

        return weekdays;
    }

    return (
        <div >
            <Toast ref={toast} />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-css use-add-patient-treatment-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <PaAside />

                        <div class="main-content">
                            <div class="content-header">
                                <h1>Book Appointment</h1>
                                <div class="content-subheader"> Book your next docotor appointments</div>
                            </div>

                            <div class="content">
                                <div class="appointment-card">
                                    <div class="header">
                                        <h1 class="title"></h1>
                                    </div>



                                        <div class="doctor-grid">


                                            {doctors?.map((obj, index) => (

                                                <div key={index} class={"doctor-option " + (selectedDoctor.id === obj.id ? "selected" : "")} onClick={(e) => { setSelectedDoctor(obj) }}>
                                                    <div class="doctor-avatar">JD</div>
                                                    <div class="doctor-info">
                                                        <div class="doctor-name">Dr. {obj.fullName}</div>
                                                        <div class="doctor-specialty">Cardiologist</div>
                                                        <div class="doctor-meta">
                                                            <span>Next available: Today</span><br />
                                                            <span>Mayo Clinic</span><br />
                                                            <span>4.9 (120+ reviews)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}



                                        </div>

                                        <div class="form-row">
                                            <div class="input-wrapper">
                                                <select class="input-field" id="appointment-type-id" required >
                                                    <option value="" disabled selected>Appointment Type</option>
                                                    <option value="LIVER_CANCER_DETECTION" >Liver Cancer Detection</option>
                                                    <option value="SCAN" >Scan</option>
                                                    <option value="OTHER" >Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <h2 class="section-title">Available Dates</h2>
                                            <div class="button-grid">
                                                {avlDates.map((date, index) => (
                                                    <button key={index} type="button" class={"option-button " + (selectedDate === date ? "selected" : "")}
                                                        onClick={(e) => {
                                                            console.log(date); setSelectedDate(date);
                                                        }}>{date}</button>
                                                ))}
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <h2 class="section-title">Available Dates</h2>
                                            <div class="time-slots">
                                                {avlTimes.pickListItems?.map((timeObj, index) => (
                                                    <button key={index} type="button" class={"time-slot " + (selectedTime === Utils.convertTime12to24(timeObj.value) ? "selected" : "")}
                                                        onClick={(e) => {
                                                            console.log(timeObj); setSelectedTime(Utils.convertTime12to24(timeObj.value));
                                                        }}>{timeObj?.value}</button>
                                                ))}

                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <br />
                                            <textarea id="description-area" name="description-area" rows="4" cols="100"></textarea>
                                        </div>
                                        <div class="action-buttons">
                                            <button type="submit" class="btn btn-primary" onClick={(e) => {

                                                setTimeout(() => {
                                                    const obj = {
                                                        description: document.getElementById("description-area").value,
                                                        appointmentDate: selectedDate + " " + selectedTime,
                                                        type: document.getElementById("appointment-type-id").value,
                                                        doctor: selectedDoctor,

                                                    }
                                                    console.log("data ", obj);

                                                    if (selectedDate == "" || selectedTime == "" || obj.type == "" || selectedDoctor.id === null) {

                                                        toast.current.show({
                                                            severity: "error",
                                                            summary: "Error",
                                                            detail: "some inputs are required",
                                                            life: 3000,
                                                        });
                                                        return;
                                                    }
                                                    setMessage("");
                                                    endPoint(config.treatmentAPIs.addpatienttreatment, "POST", obj).then((res) => {
                                                        console.log(res);
                                                        toast.current.show({
                                                            severity: "info",
                                                            summary: "Confirmed",
                                                            detail: "Treatment has been created",
                                                            life: 3000,
                                                        });

                                                        navigate("/lcd/app/patientTreatments");

                                                    });
                                                }, 200);



                                            }}>Save Appointment</button>
                                            <button type="button" class="btn btn-secondary" onClick={(e) => { window.history.go(-1); return false; }}>Back</button>
                                        </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPatientTreatment;
