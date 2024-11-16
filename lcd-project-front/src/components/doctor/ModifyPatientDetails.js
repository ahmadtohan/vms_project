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
import Aside from './../general/Aside'
import './../../css/AllDoctor.css'
import './../../css/modifyPatient.css'
import './../../css/testPatient.css'


const ModifyPatientDetails = () => {

    const toast = useRef(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const [selectedPatient, setSelectedPatient] = useState({});

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);



    useEffect(() => {

        if (!loading) {
            endPoint(
                config.userAPIs.getusers + "?type=PATIENT",
                "GET",
                null
            ).then((res) => {
                console.log(res);
                setPatients(res);
            }
            );

            setLoading(true);


        }

    });



    return (
        <div >
            <Toast ref={toast} />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-doctor-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />


                        <div className=" use-modify-patient-css" style={{ width: '100%' }}>



                            <div class="content">

                                <div class="patient-selection">
                                    <h2>Select Patient</h2>
                                    <div class="use-test-patient-css  main-content">
                                        <div class="doctor-grid">

                                            {patients?.map((obj, index) => (

                                                <div key={index} class={"doctor-option " + (selectedPatient.id === obj.id ? "selected" : "")}
                                                    onClick={(e) => {

                                                        setSelectedPatient(obj)
                                                        document.getElementById("blood-type-id").value = obj.bloodType.value;
                                                        document.getElementById("weight-id").value = obj.weight;
                                                        document.getElementById("hight-id").value = obj.hight;
                                                    }}>
                                                    <div class="doctor-avatar">MP</div>
                                                    <div class="doctor-info">
                                                        <div class="doctor-name">MR. {obj.fullName}</div>
                                                        <div class="doctor-specialty"></div>
                                                        <div class="doctor-meta">
                                                            <span></span><br />
                                                            <span></span><br />
                                                            <span>Address: UAE</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}

                                        </div>
                                    </div>
                                </div>


                                <div class="patient-info-input">
                                    <h2>Patient Information</h2>

                                    <div class="input-group">
                                        <label>Weight:</label>
                                        <input type="number" id="weight-id" name="weight" placeholder="Enter Weight" />
                                    </div>
                                    <div class="input-group">
                                        <label>Height:</label>
                                        <input type="number" id="hight-id" name="height" placeholder="Enter Height" />
                                    </div>
                                    <div class="input-group">
                                        <label>Blood Type:</label>
                                        <select name="bloodType" id="blood-type-id" required>
                                            <option value="">Select Blood Type</option>
                                            <option value="A_POS">A+</option>
                                            <option value="A_NEG">A-</option>
                                            <option value="B_POS">B+</option>
                                            <option value="B_NEG">B-</option>
                                            <option value="AB_POS">AB+</option>
                                            <option value="AB_NEG">AB-</option>
                                            <option value="O_POS">O+</option>
                                            <option value="O_NEG">O-</option>
                                        </select>
                                    </div>

                                </div>


                                <div class="vitals-section">
                                    <h3>Patient Current Vitals</h3>
                                    <div class="input-group">
                                        <label>Blood Pressure:</label>
                                        <input type="text" name="bloodPressure" placeholder="Enter Blood Pressure" />
                                    </div>
                                    <div class="input-group">
                                        <label>Heart Rate:</label>
                                        <input type="text" name="heartRate" placeholder="Enter Heart Rate" />
                                    </div>
                                    <div class="input-group">
                                        <label>Glucose Level:</label>
                                        <input type="text" name="glucose" placeholder="Enter Glucose Level" />
                                    </div>
                                    <div class="input-group">
                                        <label>Cholesterol:</label>
                                        <input type="text" name="cholesterol" placeholder="Enter Cholesterol Level" />
                                    </div>
                                </div>


                                <div class="patient-info-input">
                                    <h2>Health Status</h2>
                                    <div class="input-group">
                                        <label>Liver Condition:</label>
                                        <select name="liverCondition" >
                                            <option value="">Select Liver Condition</option>
                                            <option value="sl">SL</option>
                                            <option value="hgdn">HGDN</option>
                                            <option value="phcc">PHCC</option>
                                            <option value="lgdn">LGDN</option>
                                            <option value="ehcc">EHCC</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label>Diagnosis Date:</label>
                                        <input type="date" name="diagnosisDate" placeholder="Enter Diagnosis Date" />
                                    </div>
                                    <div class="input-group">
                                        <label>Current Status:</label>
                                        <select name="currentStatus" >
                                            <option value="">Select Current Status</option>
                                            <option value="stable">Stable</option>
                                            <option value="critical">Critical</option>
                                            <option value="under-treatment">Under Treatment</option>
                                            <option value="recovered">Recovered</option>
                                            <option value="worsening">Worsening</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label>Stage:</label>
                                        <select name="stage" >
                                            <option value="">Select Stage</option>
                                            <option value="I">Stage I</option>
                                            <option value="II">Stage II</option>
                                            <option value="III">Stage III</option>
                                            <option value="IV">Stage IV</option>
                                        </select>
                                    </div>
                                </div>



                                <button class="save-button" onClick={(e) => {

                                    setTimeout(() => {
                                        const obj = {
                                            id: selectedPatient.id,
                                            bloodType: document.getElementById("blood-type-id").value ,
                                            weight: document.getElementById("weight-id").value ,
                                            hight: document.getElementById("hight-id").value ,


                                        }
                                        obj.bloodType= obj.bloodType==""?"A_POS":obj.bloodType;
                                        console.log("data ", obj);


                                        endPoint(config.userAPIs.updatepatient, "POST", obj).then((res) => {
                                            console.log(res);
                                            toast.current.show({
                                                severity: "info",
                                                summary: "Confirmed",
                                                detail: "Patient has been updated",
                                                life: 3000,
                                            });



                                        });
                                    }, 200);



                                }}
                                >Save Information</button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyPatientDetails;
