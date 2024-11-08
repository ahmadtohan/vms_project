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
import './../../css/LogInStyle.css'


const Login = () => {
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
                        navigate("/lcd/app/patientProfile");

                    } else if (res.type.value === 'DOCTOR') {
                        navigate("/lcd/app/doctorProfile");

                    } else {
                        navigate("/lcd/app/users");
                    }

                }
            );


        }
    });



    return (
        <div  className="use-login-css">
            <div className="frame">
                <form onSubmit={formik.handleSubmit}>
                    <h1>
                        <i className="pi pi-arrow-circle-left"
                            onClick={(e) => { window.history.go(-1); return false; }}
                            style={{ fontSize: '1.5rem', marginInlineEnd: '5px', cursor: 'pointer' }}></i>
                        Log In</h1>
                    <div className="input-area">
                        <Input name="username" type="text" placeholder="Enter your Username" formik={formik} />
                        <i className="pi pi-user"></i>
                    </div>
                    <div className="input-area">
                        <Input name="password" type="password" placeholder="Enter your password" formik={formik} />
                        <i className="pi pi-lock"></i>
                    </div>
                    <div className="check-area">
                        <label for="remember me"><input type="checkbox" />Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit" className="Login-btn">Login</button>
                    <div className="UAE-Pass-Button">
                        <a className="UaePass" href="https://uaepass.ae/">
                            <img className="UaePassP" src="/lcd/uae-pass.png" alt="signup by uae pass" />
                        </a>


                    </div>
                    <div className="Register-Page-Link">
                        <p>Don't have an account? <a href="/lcd/app/addPatient" >Register</a></p>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default Login;
