import React, { useState, useEffect, useRef } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";

const AddVisitor = () => {
  const toast = useRef(null);
  const [visitor, setVisitor] = useState({});
  const [fdate, setFdate] = useState(null);
  const [tdate, setTdate] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <Tag severity="success" value="Add Visitor: "></Tag>
      <div className="flex flex-wrap gap-q  justify-content-center">
        <form onSubmit={formik.handleSubmit}>
          <span className="p-float-label" style={{ margin: "5%" }}>
            <InputText
              id="fullName"
              name="fullName"
              value={formik.values.value}
              onChange={(e) => {
                formik.setFieldValue("fullName", e.target.value);
              }}
              className={classNames({
                "p-invalid": isFormFieldInvalid("fullName"),
              })}
            />
            <label htmlFor="fullName">Full Name</label>
            <div>{getFormErrorMessage("fullName")}</div>
          </span>

          <span className="p-float-label" style={{ margin: "5%" }}>
            <InputText
              id="email"
              name="email"
              value={formik.values.value}
              onChange={(e) => {
                formik.setFieldValue("email", e.target.value);
              }}
              className={classNames({
                "p-invalid": isFormFieldInvalid("email"),
              })}
            />
            <label htmlFor="email">Email</label>
            <div>{getFormErrorMessage("email")}</div>
          </span>

          <span className="p-float-label" style={{ margin: "5%" }}>
            <InputMask
              id="eid"
              name="eid"
              value={formik.values.value}
              mask="999-9999-9999999-9"
              onChange={(e) => {
                formik.setFieldValue("eid", e.target.value);
              }}
              className={classNames({ "p-invalid": isFormFieldInvalid("eid") })}
            />
            <label htmlFor="eid">E-ID</label>
            <div>{getFormErrorMessage("eid")}</div>
          </span>

          <span
            className="p-float-label"
            style={{ margin: "5%", width: "100%" }}
          >
            <Calendar
              id="fromDate"
              name="fromDate"
              dateFormat="yy-mm-dd"
              showTime
              hourFormat="24"
              value={formik.values.value}
              onChange={(e) => {
                formik.setFieldValue("fromDate", e.target.value);
              }}
              className={classNames({
                "p-invalid": isFormFieldInvalid("fromDate"),
              })}
            />
            <label htmlFor="fromDate">from Date</label>
            <div>{getFormErrorMessage("fromDate")}</div>
          </span>

          <span
            className="p-float-label"
            style={{ margin: "5%", width: "100%" }}
          >
            <Calendar
              id="toDate"
              name="toDate"
              dateFormat="yy-mm-dd"
              showTime
              hourFormat="24"
              value={formik.values.value}
              onChange={(e) => {
                formik.setFieldValue("toDate", e.target.value);
              }}
              className={classNames({
                "p-invalid": isFormFieldInvalid("toDate"),
              })}
            />
            <label htmlFor="toDate">to Date</label>
            <div>{getFormErrorMessage("toDate")}</div>
          </span>

          <Button type="submit" label="Submit" />
        </form>
      </div>
    </div>
  );
};

export default AddVisitor;
