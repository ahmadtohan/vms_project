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

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

import Aside from './Aside'

import './../../css/dashboard.css'
import './../../css/All.css'
import './../../css/AllDoctor.css'
import Utils from "../../services/Utils";

Chart.register(CategoryScale);
const Dashboard = () => {


    const navigate = useNavigate();


    const [chartData, setChartData] = useState({
        labels: ['sl', 'lgdn', 'hgdn', 'ehcc', 'phcc'],
        datasets: [{
            data: [],
            backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b']
        }]
    });

    const [lineChartData, setLineChartData] = useState({   labels: ['sl', 'lgdn', 'hgdn', 'ehcc', 'phcc'],
        datasets: [{
            data: [],
            backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b']
        }]});

    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (!loading) {

            setTimeout(() => {

            }, 2000);

            setCurrentUser(JSON.parse(localStorage.getItem("user")));


            endPoint(
                config.userAPIs.getusers + "?type=PATIENT",
                "GET",
                null
            ).then((res) => {
                console.log(res);
                setPatients(res);
                var counts = { sl: 0, lgdn: 0, hgdn: 0, ehcc: 0, phcc: 0 }
                for (const key in res) {
                    const element = res[key];
                    
                    if (element.lastTestResult?.includes("sl")) {
                        
                        counts.sl = counts.sl + 1;
                    } else if (element.lastTestResult?.includes("lgdn")) {
                        counts.lgdn = counts.lgdn + 1;
                    }
                    else if (element.lastTestResult?.includes("hgdn")) {
                        counts.hgdn = counts.hgdn + 1;
                    }
                    else if (element.lastTestResult?.includes("ehcc")) {
                        counts.ehcc = counts.ehcc + 1;
                    }
                    else if (element.lastTestResult?.includes("phcc")) {
                        counts.phcc = counts.phcc + 1;
                    }
                    

                }
                console.log("-------ccccc----",counts);
                
            var chartinfo= {
                    labels: ['sl', 'lgdn', 'hgdn', 'ehcc', 'phcc'],
                    datasets: [{
                        data: [counts.sl, counts.lgdn, counts.hgdn, counts.ehcc, counts.phcc],
                        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b']
                    }]
                };
                setChartData(chartinfo);
                setLineChartData(chartinfo);
            }
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
            <div className={currentUser.type?.value === 'DOCTOR' ? "use-all-doctor-css" : "use-all-css"}>
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />
                        <div className="use-dashboard-css">

                            <div className="">
                                <div class="dashboard-container">
                                    <div class="header">
                                        <h1>Liver Cancer Statistics</h1>
                                        <p>Real-time analytics and insights for liver cancer diagnostics</p>
                                    </div>

                                    <div class="filter-section">
                                        <select id="timeFilter">
                                            <option value="all">All Time</option>
                                            <option value="year">Last Year</option>
                                            <option value="month">Last Month</option>
                                            <option value="week">Last Week</option>
                                        </select>
                                        <button id="updateBtn" class="btn btn-primary">Update</button>
                                    </div>


                                    <div class="stats-grid">
                                        <div class="stat-card">
                                            <h3>Total Tests</h3>
                                            <div class="value" id="totalTests">2,547</div>
                                        </div>
                                        <div class="stat-card">
                                            <h3>Liver Cancer Cases (eHCC + pHCC)</h3>
                                            <div class="value" id="liverCancerCases">412</div>
                                        </div>
                                        <div class="stat-card">
                                            <h3>Other Diagnoses</h3>
                                            <div class="value" id="otherDiagnoses">2,135</div>
                                        </div>
                                    </div>


                                    <div class="chart-grid">
                                        <div class="chart-container">
                                            <h2 class="chart-title">Distribution of Diagnoses</h2>
                                            <Bar
                                                data={chartData}
                                                options={{
                                                    plugins: {
                                                        title: {
                                                            display: true,
                                                            text: "Users Gained between 2016-2020"
                                                        },
                                                        legend: {
                                                            display: false
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <br />
                                        <div class="chart-container">
                                            <h2 class="chart-title">Diagnostic Trends Over Time</h2>
                                            <Line
                                                data={lineChartData}
                                                options={{
                                                    plugins: {
                                                        title: {
                                                            display: true,
                                                            text: "Users Gained between 2016-2020"
                                                        },
                                                        legend: {
                                                            display: false
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="info-section">
                                <h2>Diagnostic Classification Reference</h2>
                                <div class="info-grid">
                                    <div class="info-card">
                                        <h4><span class="legend-color" style={{ background: "#3498db" }}></span> SL (Suspicious Lesion)</h4>
                                        <p>Indeterminate hepatic lesions requiring further diagnostic evaluation...</p>
                                    </div>
                                    <div class="info-card">
                                        <h4><span class="legend-color" style={{ background: "#27ae60" }} ></span> LGDN (Low-Grade Dysplastic Nodule)</h4>
                                        <p>Early cellular changes with minimal atypia...</p>
                                    </div>
                                    <div class="info-card">
                                        <h4><span class="legend-color" style={{ background: "#f39c12" }} ></span> HGDN (High-Grade Dysplastic Nodule)</h4>
                                        <p>Pre-malignant lesions demonstrating significant cellular abnormalities...</p>
                                    </div>
                                    <div class="info-card">
                                        <h4><span class="legend-color" style={{ background: "#e67e22" }}  ></span> eHCC (Early Hepatocellular Carcinoma)</h4>
                                        <p>Well-differentiated HCC with favorable prognostic features...</p>
                                    </div>
                                    <div class="info-card">
                                        <h4><span class="legend-color" style={{ background: "#c0392b" }} ></span> pHCC (Progressive Hepatocellular Carcinoma)</h4>
                                        <p>Advanced stage HCC with established diagnostic imaging features...</p>
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

export default Dashboard;
