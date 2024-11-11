import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { SpeedDial } from 'primereact/speeddial';

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Input } from "./../../custom/Input";
import Utils from "./../../services/Utils";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import './../../css/addPatient.css'


const AddPatient = () => {
  const toast = useRef(null);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Utils.customBackGround(true);


  }, []);



  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      password: "",
      email: "",
      eid: "",
      birthDate: "",
      gender: "",
      mobileNumber:"",
      userRoles: [],
    },
    validate: (data) => {
      let errors = {};

      if (!data.fullName) {
        errors.fullName = "full name is required.";
      }
      if (!data.email) {
        errors.email = "email is required.";
      }
      if (!data.mobileNumber) {
        errors.mobileNumber = "mobile number is required.";
      }
      if (!data.eid) {
        errors.eid = "EID is required.";
      }

      if (!data.birthDate) {
        errors.birthDate = "birth date is required.";
      }
      if (!data.username) {
        errors.username = "username is required.";
      }
      if (!data.password) {
        errors.password = "password is required.";
      }

      if (!data.gender) {
        errors.gender = "gender is required.";
      }


      console.log("data , err: ", data, errors);
      return errors;
    },
    onSubmit: (data) => {
      const obj = Object.assign({}, data);
      setMessage("");
      obj.birthDate = Utils.formatDate(obj.birthDate);
      endPoint(config.userAPIs.addpatient, "POST", obj).then((res) => {
        console.log("--------------",res);
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "User has been created",
          life: 3000,
        });
       setTimeout(() => {
        navigate("/lcd/app/login");

       }, 50);
        
      });
    },
  });







  const genders = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  return (
    <div  className="use-add-patient-css">
      <Toast ref={toast} />
      <div className="content">
      
        <div className="sign-up-title">
        <i className="pi pi-arrow-circle-left"
         onClick={(e)=>{window.history.go(-1); return false;}}
         style={{ fontSize: '1.5rem' ,marginInlineEnd:'5px', cursor:'pointer'}}></i>
        Sign Up</div>
        <form  onSubmit={formik.handleSubmit}>
          <div className="user-details">
            <div className="input-box">
              <span className="info">Full Name</span>
              <Input name="fullName" type="text" placeholder="Enter Your Full Name"  formik={formik} />

            </div>
            <div className="input-box">
              <span className="info">E-ID</span>
              <Input name="eid" type="mask" mask="999-9999-9999999-9"  placeholder="Enter Your E-ID"  formik={formik} />

            </div>
            <div className="input-box">
              <span className="info">Email</span>
              <Input name="email" type="text" placeholder="Enter Your Email"  formik={formik} />

            </div>
            <div className="input-box">
              <span className="info">Username</span>
              <Input name="username" type="text" placeholder="Enter Your Username"  formik={formik} />

            </div>
            <div className="input-box">
              <span className="info">Password</span>
              <Input name="password" type="password" placeholder="Enter Your Password"  formik={formik} />


            </div>
            <div className="input-box">
              <span className="info">Phone Number</span>
              <Input name="mobileNumber" type="mask" mask="0-99-9999999"  placeholder="Enter Your Phone Number"  formik={formik} />

            </div>
            <div className="input-box">
              <span className="info">Birth Date</span>
              <Input name="birthDate" type="calendar" placeholder="Select Your Birth Date" formik={formik} />

            </div>
            <div className="input-box">
              <span className="info">Gender</span>
              <Input name="gender" type="dropdown" value={formik.values["gender"]}
                onChange={(e) => {
                  formik.setFieldValue("gender", e.value);
                }}
                options={genders} optionLabel="label" placeholder="Select Gender" formik={formik} />
            </div>

          </div>
          <div className="Create-Button">
            <input type="submit"   value="Create An Account" />

          </div>

        </form>

      </div>

    </div>

  );
};

export default AddPatient;
