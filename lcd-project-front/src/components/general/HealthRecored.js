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
import Utils from "../../services/Utils";

const HealthRecored = () => {


    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading) {



            setLoading(true);
        }


    });




    return (
        <div >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />
                        <div className="use-health-recored-css">
                            <div class="content">
                                <div class="header">
                                    <h2><i class="fas fa-file-medical"></i> Health Records</h2>
                                    <button class="download-btn"><i class="fas fa-download"></i> Download Records</button>
                                </div>


                                <div class="record-section">
                                    <h3>Liver Health Status</h3>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <strong>Liver Condition</strong>
                                            <span>Early Stage Hepatocellular Carcinoma</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Diagnosis Date</strong>
                                            <span>10 January 2024</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Current Status</strong>
                                            <span class="status-tag status-warning">Under Treatment</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Stage</strong>
                                            <span>Stage II</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="record-section">
                                    <h3>Recent Test Results</h3>
                                    <div class="test-results">
                                        <div class="test-item">
                                            <span class="test-name">AFP Level</span>
                                            <span class="test-value">400 ng/mL</span>
                                            <span class="test-date">Last updated: 01 Mar 2024</span>
                                            <span class="status-tag status-critical">Above Normal</span>

                                        </div>
                                        <div class="test-item">
                                            <span class="test-name">ALT</span>
                                            <span class="test-value">45 U/L</span>
                                            <span class="test-date">Last updated: 01 Mar 2024</span>
                                            <span class="status-tag status-warning">Elevated</span>


                                        </div>
                                        <div class="test-item">
                                            <span class="test-name">AST</span>
                                            <span class="test-value">42 U/L</span>
                                            <span class="test-date">Last updated: 01 Mar 2024</span>
                                            <span class="status-tag status-warning">Elevated</span>


                                        </div>
                                        <div class="test-item">
                                            <span class="test-name">Bilirubin</span>
                                            <span class="test-value">1.0 mg/dL</span>
                                            <span class="test-date">Last updated: 01 Mar 2024</span>
                                            <span class="status-tag status-higher">Normal</span>




                                        </div>

                                    </div>
                                </div>


                                <div class="record-section">
                                    <h3>Treatment History</h3>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <strong>Current Treatment</strong>
                                            <span>Chemotherapy - Sorafenib</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Treatment Start Date</strong>
                                            <span>15 January 2024</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Next Appointment</strong>
                                            <span>25 March 2024</span>
                                        </div>
                                        <div class="info-item">
                                            <strong>Treating Physician</strong>
                                            <span>Dr. John Smith</span>
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
