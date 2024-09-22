import React, { useState, useEffect, useRef } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Show } from "./../../custom/Show";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";

const VerifyVisitor = () => {
  const navigate = useNavigate();
  const accessKey = new URLSearchParams(window.location.search).get("accessKey");
  const [visitor, setVisitor] = useState({ status: {} });

  useEffect(() => {
    endPoint(config.visitorAPIs.verify + "/" + accessKey, "GET", null).then(
      (res) => {
        setVisitor(res);
      },
      (error) => {}
    );
  }, []);

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
    { visitor.id!=null? <Show rows={rows} object={visitor} severityByStatus={getSeverityByStatus} />
      :<Tag severity="danger" value="Error"></Tag>}
    </div>
  );
};

export default VerifyVisitor;
