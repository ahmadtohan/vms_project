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

    const dataSets = {
        all: {
            diagnoses: [50, 40, 30, 20, 10],
            trendsSL: [70, 65, 75, 80, 55, 60],
            trendsHGDN: [35, 45, 50, 30, 60, 25]
        },
        year: {
            diagnoses: [45, 35, 25, 15, 8],
            trendsSL: [68, 62, 78, 76, 54, 58],
            trendsHGDN: [30, 40, 48, 22, 55, 20]
        },
        month: {
            diagnoses: [20, 18, 12, 10, 5],
            trendsSL: [60, 58, 62, 70, 52, 50],
            trendsHGDN: [15, 25, 28, 18, 35, 15]
        },
        week: {
            diagnoses: [8, 6, 5, 4, 3],
            trendsSL: [55, 52, 56, 50, 45, 48],
            trendsHGDN: [10, 15, 12, 8, 20, 10]
        }
    };

    const [chartData, setChartData] = useState({
        labels: ['SL', 'LGDN', 'HGDN', 'eHCC', 'pHCC'],
        datasets: [{
            data: dataSets.all.diagnoses,
            backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b']
        }]
    });

    const [lineChartData, setLineChartData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            { label: 'SL', data: [65, 59, 80, 81, 56, 55], borderColor: '#3498db', fill: false },
            { label: 'LGDN', data: [45, 38, 55, 60, 67, 70], borderColor: '#27ae60', fill: false },
            { label: 'HGDN', data: [28, 48, 40, 19, 86, 27], borderColor: '#f1c40f', fill: false },
            { label: 'eHCC', data: [30, 25, 15, 20, 30, 45], borderColor: '#e67e22', fill: false },
            { label: 'pHCC', data: [18, 25, 30, 35, 40, 50], borderColor: '#c0392b', fill: false }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    useEffect(() => {
        if (!loading) {

            setTimeout(() => {

            }, 2000);

            setCurrentUser(JSON.parse(localStorage.getItem("user")));
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
                                        <br/>
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
