import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { SpeedDial } from 'primereact/speeddial';
import { Card } from 'primereact/card';

import { Chip } from "primereact/chip";

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
  const [avlTimes, setAvlTimes] = useState({});
  const [avlDates, setAvlDates] = useState([]);

  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

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

    endPoint(
      config.picklistAPIs.getbycode + "?code=avl_times",
      "GET",
      null
    ).then((res) => {
      console.log(res);
      setAvlTimes(res);
    }
    );

    setAvlDates(getNextFourWeekdays());

  }, []);

  function getNextFourWeekdays() {
    const weekdays = [];
    const today = new Date();

    // Start from tomorrow
    today.setDate(today.getDate() + 1);

    while (weekdays.length < 4) {
      // Check if the day is a weekday (Monday to Friday)
      if (today.getDay() !== 0 && today.getDay() !== 6) {
        weekdays.push(Utils.formatDateWithoutTime(new Date(today)));
      }
      // Move to the next day
      today.setDate(today.getDate() + 1);
    }

    return weekdays;
  }


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
    <div className="flex ">
      <Toast ref={toast} />

      <Card title="New Appointment" subTitle=""
        footer={<div> <Button label="Save" icon="pi pi-save" onClick={(e) => {
          formik.submitForm();
        }} />
          <Button label="Back" onClick={(e) => { window.history.go(-1); return false; }}
            severity="secondary" icon="pi pi-arrow-circle-left" style={{ marginLeft: '0.5em' }} />
        </div>}
        header={<div> </div>}
        style={{ marginTop: '50px' }}
        className="md:w-45rem">
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

            <Input name="description" type="textarea" title="Description" formik={formik} />

          </div>

          <div >
            <div>
              <h2> Available Dates</h2>
            </div>
            <br />
            <div>
              {avlDates.map((date, index) => (
                <Chip
                  onClick={(e) => {
                    console.log(date); setSelectedDate(date);
                    formik.setFieldValue("appointmentDate", date + " " + Utils.convertTime12to24(selectedTime));

                  }}
                  key={index}
                  label={date}
                  style={{
                    marginInlineEnd: "8px", cursor: 'pointer',
                    backgroundColor: selectedDate === date ? '#8af98a' : ''
                  }}
                />
              ))}
            </div>

          </div>
          <br /><br />
          <div >
            <div>
              <h2> Available Times</h2>
            </div>
            <br />
            <div>
              {avlTimes.pickListItems?.map((timeObj, index) => (
                <Chip
                  onClick={(e) => {
                    console.log(timeObj); setSelectedTime(timeObj.value)
                    formik.setFieldValue("appointmentDate", selectedDate + " " + Utils.convertTime12to24(timeObj.value));
                  }}
                  key={index}
                  label={timeObj?.value}
                  style={{
                    marginInlineEnd: "8px", cursor: 'pointer',
                    backgroundColor: selectedTime === timeObj.value ? '#8af98a' : ''
                  }}
                />
              ))}
            </div>
            <div>
              <span style={{ color: 'red' }}>{formik.errors?.appointmentDate}</span>
            </div>
          </div>
        </form>
      </Card>






    </div>
  );
};

export default AddPatientTreatment;
