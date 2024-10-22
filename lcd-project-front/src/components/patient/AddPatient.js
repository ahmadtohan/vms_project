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
      roles: [],
    },
    validate: (data) => {
      let errors = {};

      if (!data.fullName) {
        errors.fullName = "username is required.";
      }
      if (!data.email) {
        errors.email = "email is required.";
      }
      if (!data.eid) {
        errors.eid = "EID is required.";
      }

      if (!data.birthDate) {
        errors.birthDate = "birthDate is required.";
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
        console.log(res);
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "User has been created",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/lcd/app/login");
        }, "500");
      });
    },
  });







  const genders = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  return (
    <div className="card">
      <Toast ref={toast} />
      <Tag severity="success" style={{ marginBottom: '40px' }} value="Add Patient: "></Tag>

      <form onSubmit={formik.handleSubmit}>

        <div className="flex align-items-center">
          <Input name="fullName" type="text" title="Full Name" formik={formik} />

          <Input name="email" type="text" title="Email" formik={formik} />

          <Input name="eid" type="mask" mask="999-9999-9999999-9" title="E-ID" formik={formik} />

          <Input name="birthDate" type="calendar" title="Birth Date" formik={formik} />

          <Input name="gender" type="dropdown" title="Gender" value={formik.values["gender"]}
            onChange={(e) => {
              formik.setFieldValue("gender", e.value);
            }}
            options={genders} optionLabel="label" placeholder="Select Gender" formik={formik} />

        </div>


        <div className="flex align-items-center">

          <Input name="username" type="text" title="Username" formik={formik} />
          <Input name="password" type="password" title="Password" formik={formik} />

        


        </div>


        <SpeedDial type="submit"
          onClick={(e) => {
            formik.submitForm();
          }}
          direction="up" transitionDelay={80} showIcon="pi pi-save" hideIcon="pi pi-save" buttonClassName="p-button-help"
          style={{ right: "2rem", bottom: "2rem", position: "fixed" }}
        />
      </form>
    </div>
  );
};

export default AddPatient;
