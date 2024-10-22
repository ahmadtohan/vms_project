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

const AddPatientTreatment = () => {
  const toast = useRef(null);
  const [treatment, setTreatment] = useState({});
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState(null);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    endPoint(
      config.userAPIs.getusers + "?type=DOCTOR",
      "GET",
      null
    ).then((res) => {
      console.log(res);
      setDoctors(res);
    }
    );


  }, []);

  const searchDoctor = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filtered;

      if (!event.query.trim().length) {
        filteredDoctors = [...doctors];
      }
      else {
        _filtered = doctors.filter((obj) => {
          return obj.fullName.toLowerCase().includes(event.query.toLowerCase());
        });
      }

      setFilteredDoctors(_filtered);
    }, 50);
  }



  const formik = useFormik({
    initialValues: {
      description: "",
      appointmentDate: "",
      type: "",
      status: null,
      doctor: null,
      patient: null,
    },
    validate: (data) => {
      let errors = {};

      if (!data.description) {
        errors.description = "description is required.";
      }
      if (!data.appointmentDate) {
        errors.appointmentDate = "appointmentDate is required.";
      }


      if (!data.type) {
        errors.type = "type is required.";
      }

      if (!data.doctor) {
        errors.doctor = "doctor is required.";
      }

      console.log("data , err: ", data, errors);
      return errors;
    },
    onSubmit: (data) => {
      const obj = Object.assign({}, data);
      setMessage("");
      obj.appointmentDate = Utils.formatDate(obj.appointmentDate);
      endPoint(config.treatmentAPIs.addpatienttreatment, "POST", obj).then((res) => {
        console.log(res);
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "Treatment has been created",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/lcd/app/patientTreatments");
        }, "500");
      });
    },
  });





  const types = [
    { value: "LIVER_CANCER_DETECTION", label: "Liver Cancer Detection" },
    { value: "SCAN", label: "Scan" },
    { value: "OTHER", label: "Other" }
  ];



  return (
    <div className="card">
      <Toast ref={toast} />
      <Tag severity="success" style={{ marginBottom: '40px' }} value="Add Appointment Treatment: "></Tag>

      <form onSubmit={formik.handleSubmit}>



        <div className="flex align-items-center">



          <Input name="doctor" type="autoComplete" field="fullName" value={formik.values["doctor"]}
            title="Doctor" multiple="false" suggestions={filteredDoctors} completeMethod={searchDoctor}
            onChange={(e) => { formik.setFieldValue("doctor", e.value); }} formik={formik} />

          <Input name="type" type="dropdown" title="Type" value={formik.values["type"]}
            onChange={(e) => {
              formik.setFieldValue("type", e.value);

            }}
            options={types} optionLabel="label" placeholder="Select Type" formik={formik} />


        </div>




        <div className="flex align-items-center">
          <Input name="appointmentDate" type="calendar" title="Appointment Date" formik={formik} />

          <Input name="description" type="textarea" title="Description" formik={formik} />



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

export default AddPatientTreatment;
