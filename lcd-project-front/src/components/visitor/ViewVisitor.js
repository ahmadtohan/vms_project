import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";

import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { SpeedDial } from "primereact/speeddial";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Show } from "./../../custom/Show";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const ViewVisitor = () => {
  const navigate = useNavigate();
  const id = new URLSearchParams(window.location.search).get("id");
  const [visitor, setVisitor] = useState({ status: {} });

  useEffect(() => {
    endPoint(config.visitorAPIs.view + "/" + id, "GET", null).then(
      (res) => {
        setVisitor(res);
      },
      (error) => {}
    );
  }, []);

const redirectItems = [
    {
      label: "Add",
      icon: "pi pi-pencil",
      command: () => {
        navigate("/vms/app/editVisitor");
      },
    },
         {
           label: "Delete",
           icon: "pi pi-trash",
           command: () => {},
         },
    {
      label: "Update",
      icon: "pi pi-refresh",
      command: () => {
        window.location.reload();
      },
    }
  ];

  const getSeverityByStatus = (statusVal) => {
    switch (statusVal) {
      case "Approved":
        return "success";

      case "Pending":
        return "warning";

      case "Cancelled":
        return "danger";

      default:
        return null;
    }
  };
const rows = {
  1: {
    fullName: {
      label: "Full Name",
      icon: "pi pi-user",
    },
    email: {
      label: "Email",
      icon: "pi pi-bookmark",
    },
    eid: {
      label: "E-ID",
      icon: "pi pi-id-card",
    },
    status: {
      isTag: true,
      subKey: "label",
      label: "Status",
      icon: "pi pi-bookmark",
    }
  },

  2: {
    fromDate: {
      label: "from Date",
      icon: "pi pi-calendar",
    },
    toDate: {
      label: "to Date",
      icon: "pi pi-calendar",
    }
  }
};



  return (
    <div className="card">
    <Show rows={rows} object={visitor} severityByStatus={getSeverityByStatus} />

          <SpeedDial
                 model={redirectItems}
                 direction="up" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined"
                 style={{ right: "2rem", bottom: "2rem", position: "fixed" }}
                 buttonClassName="p-button-help"
               />
    </div>
  );
};

export default ViewVisitor;
