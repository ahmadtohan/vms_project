import React, { useState, useEffect, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from "primereact/tag";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Input } from "./../../custom/Input";

import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { useNavigate } from "react-router-dom";
import EventBus from "./../../common/eventBus";

import './../../css/home.css'


const Home = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {



    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.username) {
                errors.username = 'username is required.';
            }
            if (!data.password) {
                errors.password = 'password is required.';
            }

            return errors;
        },
        onSubmit: (data) => {

            setMessage("");
            console.log(config);
            endPoint(config.userAPIs.login, "POST", data).then(
                (res) => {
                    console.log("--------", res);
                    EventBus.dispatch("handelUserLogged", res);
                    if (res.type.value === 'PATIENT') {
                        navigate("/lcd/app/patientTreatments");

                    } else if (res.type.value === 'DOCTOR') {
                        navigate("/lcd/app/doctorTreatments");

                    } else {
                        navigate("/lcd/app/users");
                    }

                }
            );


        }
    });



    return (
        <div  >

            <link rel="icon" type="image/x-icon" href="https://t3.ftcdn.net/jpg/06/12/89/52/360_F_612895290_5m4XeQsdmekGhrRlgId6HB3jfPkKvzwq.jpg" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet"></link>
            <div className='use-home-css'>
                <nav class="navbar">
                    <div class="logo">Liver Cancer Detection</div>
                    <ul class="nav-links">
                        <li><a href="/lcd/app/home" class="active">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Detection Methods</a></li>
                        <li><a href="#">Research</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>

                <header class="hero">
                    <div class="hero-content">
                        <h1>Detecting Liver Cancer Early Saves Lives!</h1>
                        <p>Utilizing advanced technology to improve early detection and treatment.</p>
                        <a href="https://www.youtube.com/embed/xjJWAdjLKEo" class="cta-button" target="_blank">Learn More</a>
                        <a href="/lcd/app/login" class="cta-button" >Get Started</a>
                    </div>
                </header>
                <section class="specialties">
                    <h2>Our Specialties</h2>
                    <div class="specialty-grid">
                        <div class="specialty">
                            <i class="fas fa-user-md fa-3x"></i>
                            <h3>Liver Oncology</h3>
                            <p>Specialized care for patients with liver cancer.</p>
                        </div>
                        <div class="specialty">
                            <i class="fas fa-stethoscope fa-3x"></i>
                            <h3>Genetic Testing</h3>
                            <p>Advanced genetic analysis for risk assessment.</p>
                        </div>
                        <div class="specialty">
                            <i class="fas fa-ambulance fa-3x"></i>
                            <h3>Emergency Care</h3>
                            <p>Rapid response for liver-related emergencies.</p>
                        </div>
                        <div class="specialty">
                            <i class="fas fa-laptop-medical fa-3x"></i>
                            <h3>Research</h3>
                            <p>Pioneering research to enhance detection methods.</p>
                        </div>
                        <div class="specialty">
                            <i class="fas fa-heartbeat fa-3x"></i>
                            <h3>Patient Support</h3>
                            <p>Comprehensive support for patients and families.</p>
                        </div>
                    </div>
                </section>

                <section class="goals-objectives">
                    <div class="goal-container">
                        <div class="our-goal">
                            <h2>Our Goal</h2>
                            <div class="goal-content">
                                <p>
                                    Through the creative application of machine learning and artificial intelligence (AI), our initiative aims to revolutionize the early identification and detection of liver cancer. We are focused on developing AI algorithms that can precisely identify patterns indicative of liver cancer using a large dataset enriched with genetic information from multiple sources. This innovative approach enhances the accuracy of liver cancer detection while providing new insights into the genetic markers associated with cancer development.
                                </p>
                                <p>
                                    By integrating these advanced AI techniques with substantial genetic data, our project strives to drive significant advancements in oncological research, potentially leading to earlier therapeutic interventions and better patient outcomes. Essential to our methodology is the acquisition and analysis of two key datasets: the Cancer Genome Atlas (TCGA) and the Lübeck University Dataset, which together offer a detailed genetic view that could enable the detection of early symptoms with unprecedented precision.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="objectives-container">
                        <div class="objectives">
                            <h2>Objectives</h2>
                            <div class="objective-grid">
                                <div class="objective">
                                    <h3>AI Training</h3>
                                    <p>Train and refine artificial intelligence algorithms to accurately detect liver cancer patterns by utilizing comprehensive genetic data from the Cancer Genome Atlas and the Lübeck University Dataset.</p>
                                </div>
                                <div class="objective">
                                    <h3>Precision Improvement</h3>
                                    <p>Improve the precision and effectiveness of liver cancer detection through the integration of machine learning techniques and a diverse array of genetic information.</p>
                                </div>
                                <div class="objective">
                                    <h3>Early Identification</h3>
                                    <p>Leverage sophisticated AI technologies to facilitate the early identification of liver cancer, aiming to significantly improve patient outcomes by enabling prompt and targeted treatment strategies.</p>
                                </div>
                                <div class="objective">
                                    <h3>Data Integration</h3> 
                                    <p>Integrate diverse datasets and genetic profiles to enhance the accuracy of AI models in detecting liver cancer at early stages.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer class="footer">
                    <p>&copy; 2024 Liver Cancer Detection. All rights reserved.</p>
                    <div class="footer-links">
                        <a href="#">Privacy Policy</a> |
                        <a href="#">Terms of Service</a> |
                        <a href="#">Support</a>
                    </div>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </footer>
            </div>

        </div>
    );
};

export default Home;
