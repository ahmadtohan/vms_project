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

const ViewPatientTreatment = () => {
  const navigate = useNavigate();
  const id = new URLSearchParams(window.location.search).get("id");
  const [treatment, setTreatment] = useState({
    status: {},
    type: {},
    doctor: {},
    patient: {},
  });

  useEffect(() => {
    endPoint(config.treatmentAPIs.getpatienttreatment + "/" + id, "GET", null).then(
      (res) => {
        setTreatment(res);
      },
      (error) => {}
    );
  }, []);

  const redirectItems = [
    {
      label: "List",
      icon: "pi pi-list",
      command: () => {
        navigate("/lcd/app/patientTreatments");
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

export default ViewPatientTreatment;
