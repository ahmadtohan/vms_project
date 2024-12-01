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


import Aside from './Aside'

import './../../css/healthRecored.css'
import './../../css/All.css'
import './../../css/AllDoctor.css'

import Utils from "../../services/Utils";

const HealthRecored = () => {


    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [treatment, setTreatment] = useState({});


    useEffect(() => {
        if (!loading) {


            setCurrentUser(JSON.parse(localStorage.getItem("user")));

            endPoint(
                config.treatmentAPIs.patienttreatmentlistPage +
                "?page=0" +
                "&size=" +
                1 + "&sort=id,DESC",
                "POST",
            ).then((res) => {
                console.log(res);

                setTreatment(res.content[0]);
                console.log(
                    "=======res====",
                    res.content[0]
                );
            });


            setLoading(true);
        }


    });




    return (
        <div >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className={currentUser.type?.value === 'DOCTOR' ?"use-all-doctor-css":"use-all-css"}>
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />
                        <div className="use-health-recored-css">
                            <div class="content">
                            <div class="content-header">
                    <h1>Health Records</h1> 
                    <div class="content-subheader"> view your health records</div>
                <div class="header">
                   
                
                </div>
                </div>


                                <div class="record-section">
                                    <h3>Liver Health Status</h3>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <strong>Liver Condition</strong>
                                            <span>{currentUser.lastTestResult}</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Diagnosis Date</strong>
                                            <span>{currentUser.diagnosisDate}</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Current Status</strong>
                                            <span class="status-tag status-warning">{currentUser.currentStatus}</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Stage</strong>
                                            <span> {"Stage "+currentUser.stage}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="record-section">
                                    <h3>Recommendations</h3>
                                    <div class="test-results">
                                        <div class="test-item">
                                            <span class="test-name"> no indication the presence of hepatocellular carcinoma (HCC).</span>
                                            <span class="test-value"></span>
                                            <span class="test-date">It's important to maintain a healthy lifestyle, including regular check-ups, a balanced diet, and avoiding alcohol and toxins.</span>
                                            <span class="status-tag status-higher">SL</span>

                                        </div>
                                        <div class="test-item">
                                            <span class="test-name">patients diagnosed with early-stage HCC</span>
                                            <span class="test-value"></span>
                                            <span class="test-date">blood tests is critical to ensure the cancer has not returned and to detect any early signs of recurrence</span>
                                            <span class="status-tag status-higher">EHCC</span>


                                        </div>
                                        </div>

                                        <div class="test-results">
                                        <div class="test-item">
                                            <span class="test-name">Low risk of progressing to HCC	</span>
                                            <span class="test-value"></span>
                                            <span class="test-date"> Maintaining a healthy lifestyle and staying up to date with scheduled scans is key to detecting any changes early.</span>
                                            <span class="status-tag status-higher">LGDN</span>


                                        </div>
                                        
                                        <div class="test-item">
                                            <span class="test-name"> advanced-stage HCC</span>
                                            <span class="test-value"></span>
                                            <span class="test-date">blood tests are essential to track the progression of the disease</span>
                                            <span class="status-tag status-higher">PHCC</span>
                                     </div>
                                     </div>


                                     <div class="test-results">
                                     <div class="test-item">
                                            <span class="test-name">High-grade dysplastic nodules carry a higher risk of turning into cancer</span>
                                            <span class="test-value"></span>
                                            <span class="test-date">
                                            While HGDN are precancerous, maintaining a healthy liver environment can reduce the risk of progression. Avoid alcohol, maintain a healthy diet rich in fruits, vegetables, and lean proteins, and exercise regularly to support overall liver health.
                                            </span>
                                            <span class="status-tag status-higher">HGDN</span>


                                        </div>

                                        </div>
                                        
                                  
                                </div>


                                <div class="record-section">
                                    <h3>Treatment History</h3>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <strong>Current Treatment</strong>
                                            <span>{treatment?.type?.label}</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Treatment Start Date</strong>
                                            <span>{treatment?.appointmentDate?.split(' ')[0]}</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Next Appointment</strong>
                                            <span>10 January 2025</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Treating Physician</strong>
                                            <span>Dr. {treatment?.doctor?.fullName}</span>
                                        </div>
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

export default HealthRecored;
