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
import './../../css/doctorProfile.css'
const DoctorProfile = () => {

    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading) {
            setCurrentUser(JSON.parse(localStorage.getItem("user")));

            console.log(currentUser);

            setLoading(true);
        }
    });


    return (
        <div >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-doctor-css use-doctor-profile-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />

                        <div class="content">
                            <div class="content-header">
                                <h1>View Profile</h1>
                                <div class="content-subheader"> Mange your profile</div>
                                <div class="header">
                                    

                                </div>
                            </div>


                            <div class="patient-info">
                                <img src="https://cdn2.stylecraze.com/wp-content/uploads/2013/07/Beautiful-Russian-Women.jpg.avif" alt="Mrs. Maria Waston" />
                                <div class="patient-details">
                                    <div>
                                        <strong>Full Name</strong>
                                        {currentUser.fullName}
                                    </div>
                                    <div>
                                        <strong>Email</strong>
                                        {currentUser.email}
                                    </div>
                                    <div>
                                        <strong>Department</strong>
                                        LCD Department
                                    </div>
                                    <div>
                                        <strong>Position</strong>
                                        DOCTOR
                                    </div>

                                    <div>
                                        <strong>Birth Date</strong>
                                        {currentUser.birthDate?.split(' ')[0]}
                                    </div>
                                    <div>
                                        <strong>Sex</strong>
                                        {currentUser.gender?.label}
                                    </div>
                                    <div>
                                        <strong>Status</strong>
                                        {currentUser.status?.label}
                                    </div>
                                    <div>
                                        <strong>Nationality</strong>
                                        {currentUser.nationality?.value}
                                    </div>
                                    <div>
                                        <strong>User Name</strong>
                                        {currentUser.username}
                                    </div>
                                    <div>
                                        <strong>E-ID</strong>
                                        {currentUser.eid}
                                    </div>

                                    <div>
                                        <strong>Registered Date</strong>
                                        {currentUser.creationDate}
                                    </div>
                                </div>
                            </div>




                              
                <div class="profile-section">
                    <h3><i class="fas fa-calendar-alt"></i> Upcoming Appointments</h3>
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date of Appointment</th>
                                <th>Reason</th>
                                <th>Severity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>20 Nov, 2024</td>
                                <td>Routine Checkup</td>
                                <td>Low</td>
                                <td><span class="status-badge status-upcoming">Upcoming</span></td>
                            </tr>
                            <tr>
                                <td>20 Nov, 2024</td>
                                <td>Routine Checkup</td>
                                <td>Low</td>
                                <td><span class="status-badge status-upcoming">Upcoming</span></td>
                            </tr> 
                            <tr>
                                <td>20 Nov, 2024</td>
                                <td>Routine Checkup</td>
                                <td>Low</td>
                                <td><span class="status-badge status-upcoming">Upcoming</span></td>
                            </tr>
                           
                        </tbody>
                    </table>
                </div>
                
                <div class="profile-section">
                    <h3><i class="fas fa-check-circle"></i> Completed Appointments</h3>
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date of Visit</th>
                                <th>Diagnosis</th>
                                <th>Severity</th>
                                <th>Total Visits</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01 Feb, 2024</td>
                                <td>Liver Function Test</td>
                                <td>Medium</td>
                                <td>2</td>
                                <td><span class="status-badge status-completed">Completed</span></td>
                            </tr>
                          
                        </tbody>
                    </table>
                </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
