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
import './../../css/testPatient.css'
const TestPatient = () => {

    const toast = useRef(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const [avlTimes, setAvlTimes] = useState({});
    const [avlDates, setAvlDates] = useState([]);

    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedPatient, setSelectedPatient] = useState({});

    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {

        if (!loading) {
            endPoint(
                config.userAPIs.getusers + "?type=PATIENT",
                "GET",
                null
            ).then((res) => {
                console.log(res);
                setPatients(res);
                setFilteredPatients(res);
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

            endPoint(
                config.parameterAPIs.getbycode + "?code=number_of_avl_dates",
                "GET",
                null
            ).then((res) => {
                console.log(res);
                setAvlDates(getNextFourWeekdays(parseInt(res.value)));
            }
            );
            setLoading(true);


            setTimeout(() => {
                
        document.getElementById("geneForm").addEventListener("submit", function(event) {
            event.preventDefault();
        
            // Show loading spinner
            document.getElementById("loading").style.display = "block";
        
            // Hide result container initially
            document.getElementById("result").style.display = "none"; 
        
            // Simulate a brief delay for processing
            setTimeout(function() {
                // Get the values from the input fields
                var DNAJB14 = document.getElementById("DNAJB14").value;
                var ADCY5 = document.getElementById("ADCY5").value;
                var AGPAT2 = document.getElementById("AGPAT2").value;
                var AGTR1 = document.getElementById("AGTR1").value;
                var AIFM1 = document.getElementById("AIFM1").value;
        
                // Check if all fields have values
                if (DNAJB14 && ADCY5 && AGPAT2 && AGTR1 && AIFM1) {
                    // Simulate the output result (for example SL, LGDN, HGDN, etc.)
                    var resultOutcome = "SL"; // In your case, calculate based on the inputs
        
                    // Display the result inside the result container
                    var resultBox = document.getElementById("result");
                    resultBox.innerHTML = `
                        <h3>Result:</h3>
                        <p>${resultOutcome}</p>
                    `;
        
                    // Hide the loading spinner and show the result container with animation
                    document.getElementById("loading").style.display = "none";
                    resultBox.style.display = "block"; // Show result container
                } else {
                    alert("Please fill in all the fields.");
                    document.getElementById("loading").style.display = "none";  // Hide loading spinner
                }
            }, 2000); // 2 seconds simulation delay
        });
        
       
            }, 3000);
        }

    });




    function getNextFourWeekdays(num_of_dates) {
        const weekdays = [];
        const today = new Date();

        // Start from tomorrow
        today.setDate(today.getDate() + 1);

        while (weekdays.length < num_of_dates) {
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
            <div className="use-all-doctor-css use-test-patient-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />

                        <div class="main-content">
                            <div class="content-header">
                                <h1>Gene Data Input</h1>
                                <div class="content-subheader">Enter the numeric values for the genes below:</div>
                            </div>

                            <div class="search-doctor">
                                <input type="text" id="idSearch" onChange={(e) => {

                                    setSearchValue(e.target.value);
                                }} placeholder="Search by ID" />
                                <button id="searchButton" class="search-btn" onClick={
                                    (e) => {
                                        var found=false;
                                        patients.forEach(element => {
                                            console.log(searchValue)
                                            if (element.id == searchValue) {
                                                var arr=[];
                                                arr.push(element);
                                                setFilteredPatients(arr);
                                                found=true;

                                            }
                                        });
                                        if(!found){
                                        setFilteredPatients(patients);
                                        }

                                    }
                                }>Search</button>
                            </div>


                            <div class="doctor-grid">

                                {filteredPatients?.map((obj, index) => (

                                    <div key={index} class={"doctor-option " + (selectedPatient.id === obj.id ? "selected" : "")} onClick={(e) => { setSelectedPatient(obj) }}>
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


                            <div class="container">
                                <form id="geneForm">
                                    <div class="form-row">
                                        <div class="input-wrapper">
                                            <span for="DNAJB14">DNAJB14</span>
                                            <input class="input-field" type="number" id="DNAJB14" placeholder="Enter DNAJB14 Value" required />
                                        </div>
                                        <div class="input-wrapper">
                                            <span for="ADCY5">ADCY5</span>
                                            <input class="input-field" type="number" id="ADCY5" placeholder="Enter ADCY5 Value" required />
                                        </div>
                                        <div class="input-wrapper">
                                            <span for="AGPAT2">AGPAT2</span>
                                            <input class="input-field" type="number" id="AGPAT2" placeholder="Enter AGPAT2 Value" required />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="input-wrapper">
                                            <span for="AGTR1">AGTR1</span>
                                            <input class="input-field" type="number" id="AGTR1" placeholder="Enter AGTR1 Value" required />
                                        </div>
                                        <div class="input-wrapper">
                                            <span for="AIFM1">AIFM1</span>
                                            <input class="input-field" type="number" id="AIFM1" placeholder="Enter AIFM1 Value" required />
                                        </div>
                                    </div>

                                    <button type="submit" class="submit-btn">Submit</button>
                                   <br/> <br/> <br/>  <div id="result" class="result-container" style={{ display: "none" }}></div>
                                </form>


                                <div id="loading" class="loading" style={{ display: "none" }}>
                                    <i class="fas fa-spinner"></i>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPatient;
