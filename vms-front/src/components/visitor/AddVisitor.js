import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { SpeedDial } from 'primereact/speeddial';

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Input } from "./../../custom/Input";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const AddVisitor = () => {
  const toast = useRef(null);
  const [visitor, setVisitor] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      eid: "",
      fromDate: "",
      toDate: "",
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
      if (!data.fromDate) {
        errors.fromDate = "fromDate is required.";
      }
      if (!data.toDate) {
        errors.toDate = "toDate is required.";
      }
      return errors;
    },
    onSubmit: (data) => {

      setMessage("");
      data.fromDate = formatDate(data.fromDate);
      data.toDate = formatDate(data.toDate);
      endPoint(config.visitorAPIs.create, "POST", data).then((res) => {
        console.log(res);
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "Visitor has been created",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/vms/app/visitors");
        }, "500");
      });
    },
  });

  function formatDate(date) {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  }



  return (
    <div className="card">
      <Toast ref={toast} />
      <Tag severity="success" style={{marginBottom:'40px'}} value="Add Visitor: "></Tag>
        <form onSubmit={formik.handleSubmit} >

        <div className="flex align-items-center" >
       <Input name="fullName" type ="text" title="Full Name"  formik={formik} />
       <Input name="email" type ="text" title="Email"  formik={formik} />
       <Input name="eid" type ="mask" mask="999-9999-9999999-9" title="E-ID"  formik={formik} />
       </div>


        <div className="flex align-items-center">
                <Input name="fromDate" type ="calendar" title="from Date"  formik={formik} />
                <Input name="toDate" type ="calendar" title="to Date"  formik={formik} />

        </div>

          <SpeedDial type="submit"
          onClick={(e) => {
                          formik.submitForm();
                        }}
          direction="up" transitionDelay={80} showIcon="pi pi-save" hideIcon="pi pi-save" buttonClassName="p-button-outlined"
                     style={{ right: "2rem", bottom: "2rem", position: "fixed" }}
                    buttonClassName="p-button-help" />

        </form>


    </div>
  );
};

export default AddVisitor;
