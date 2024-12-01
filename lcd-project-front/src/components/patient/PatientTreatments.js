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
import './../../css/All.css'
import './../../css/patientTreatments.css'
const PatientTreatments = () => {

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading) {

            list(
                0,
                100,
                "id,DESC",
                
                []
            );
            setLoading(true);
        }
    });

    const list = (page, size, sort, cond) => {
        sort = sort == null ? "id" : sort;
        endPoint(
            config.treatmentAPIs.patienttreatmentlistPage +
            "?page=" +
            page +
            "&size=" +
            size +
            "&sort=" +
            sort,
            "POST"
        ).then((res) => {
            console.log(res);

            setTreatments(res.content);
            console.log(
                "=======res====",
                res
            );
        });
    };

    ////////////////////////////////////
    const getSeverityByStatus = (statusVal) => {
        switch (statusVal) {
          case "Done":
            return "success";
    
          case "Cancelled":
            return "danger";
          case "Pending":
            return "warning";
    
          default:
            return null;
        }
      };
    
      const statusBodyTemplate = (rowData) => {
        return (
          <span
          >{rowData.status.label}</span>
        );
      };

    return (
        <div >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-css use-patient-treatments-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />

                        <div class="main-content">
                            <div class="content-header">
                                <h1>Your Appointments</h1>
                                <div class="content-subheader">Manage your upcoming doctor appointments</div>
                            </div>

                            <div class="appointments-container" id="appointmentsContainer">

                                {treatments?.map((obj, index) => (
                                    <div class="card" key={index}>
                                        <div class="doctor-info">
                                            <div class="doctor-avatar">
                                                <i class="fas fa-user-md"></i>
                                            </div>
                                            <div class="doctor-details">
                                                <div class="doctor-name">Dr. {obj?.doctor?.fullName}</div>
                                                <div class="doctor-specialty">Oncologist</div>
                                            </div>
                                        </div>
                                        <div class="appointment-info">
                                            <div class="time-location">
                                                <div class="appointment-time">
                                                    <i class="far fa-clock"></i>
                                                    {obj?.appointmentDate}
                                                </div>
                                                <div class="appointment-location">
                                                    <i class="fas fa-map-marker-alt"></i>
                                                    Memorial Hospital, Room 302
                                                     
                                                </div>
                                            </div>
                                            <span class={"status-badge status-"+(obj.status?.label==="Done"?"confirmed":"pending")}> {statusBodyTemplate(obj)}</span>
                                        </div>
                                        <div class="card-actions" style={{width:obj.status?.label !== "Pending"?'50%':''}}>
                                            <button class="btn btn-primary"  onClick={(e) => {  navigate("/lcd/app/viewPatientTreatment?id=" + obj.id); }}>

                                                View Details
                                            </button>
                                            {obj.status?.label === "Pending" && <button style={{width:'50%'}} class="btn btn-secondary"
                                                onClick={(e) => {
                                                    endPoint(config.treatmentAPIs.changetreatmentstatus+"/"+obj.id+"?status=CANCELLED", "POST", {}).then((res) => {                                                     

                                                        navigate("/lcd/app/viewPatientTreatment?id=" + obj.id);

                                                    });
                                                    
                                                }}
                                            >
                                                <i class="fas fa-trash-alt"></i>
                                                Cancel
                                            </button>}
                                        </div>
                                    </div>


                                ))}
                            </div>
                        </div>

                     

                    </div>
                </div>
            </div>

        </div>
    );
};

export default PatientTreatments;
