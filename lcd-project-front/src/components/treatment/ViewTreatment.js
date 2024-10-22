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

const ViewTreatment = () => {
  const navigate = useNavigate();
  const id = new URLSearchParams(window.location.search).get("id");
  const [treatment, setTreatment] = useState({
    status: {},
    type: {},
    doctor: {},
    patient: {},
  });

  useEffect(() => {
    endPoint(config.treatmentAPIs.view + "/" + id, "GET", null).then(
      (res) => {
        setTreatment(res);
      },
      (error) => {}
    );
  }, []);

  const redirectItems = [
    {
      label: "Add",
      icon: "pi pi-pencil",
      command: () => {
        navigate("/lcd/app/editTreatment");
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        
        endPoint(config.treatmentAPIs.delete + "/" + id, "DELETE", null).then(
          (res) => {
            navigate("/lcd/app/treatments");
          },
          (error) => {}
        );
      },
    },
    {
      label: "Update",
      icon: "pi pi-refresh",
      command: () => {
        window.location.reload();
      },
    },
  ];

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
  const rows = {
    1: {
      patient: {
        label: "Patient",
        icon: "pi pi-user",
        subKey: "fullName",
      },
      doctor: {
        label: "Doctor",
        icon: "pi pi-user",
        subKey: "fullName",
      }
    },

    2: {

      type: {
        subKey: "label",
        label: "Type",
        icon: "pi pi-bookmark",
      },
      status: {
        isTag: true,
        subKey: "label",
        label: "Status",
        icon: "pi pi-bookmark",
      },
     
    },
    3:{
      description: {
        label: "Description",
        icon: "pi pi-bookmark",
      },
      appointmentDate: {
        label: "Appointment Date",
        icon: "pi pi-calendar",
      },

    }
  };

  return (
    <div className="card">
      <Show rows={rows} object={treatment} severityByStatus={getSeverityByStatus} />

  

      <SpeedDial
        model={redirectItems}
        direction="up"
        transitionDelay={80}
        showIcon="pi pi-bars"
        hideIcon="pi pi-times"
        buttonClassName="p-button-help"
        style={{ right: "2rem", bottom: "2rem", position: "fixed" }}
      />
    </div>
  );
};

export default ViewTreatment;
