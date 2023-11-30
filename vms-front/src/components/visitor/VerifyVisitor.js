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
    { visitor.id!=null?Object.keys(rows).map((row) => (
      <div key={row}  className="flex align-items-center gap-3">
        {Object.keys(rows[row]).map((key) => (
          <div key={key} style={{ margin: "20px" }}>
            <span className="flex align-items-center gap-2">
              <i className={rows[row][key].icon}></i>

              <span className="font-semibold">
                {rows[row][key]["isTag"] === true ? (
                  <Tag
                    severity={getSeverityByStatus(
                      rows[row][key]["subKey"] !== undefined
                        ? visitor[key][rows[row][key]["subKey"]]
                        : visitor[key]
                    )}
                  >
                    {rows[row][key]["subKey"] !== undefined
                      ? visitor[key][rows[row][key]["subKey"]]
                      : visitor[key]}
                  </Tag>
                ) : rows[row][key]["subKey"] !== undefined ? (
                  visitor[key][rows[row][key]["subKey"]]
                ) : (
                  visitor[key]
                )}


              </span>
            </span>
            <small>{rows[row][key].label}</small>
          </div>
        ))}
      </div>
      ))
      :<Tag severity="danger" value="Error"></Tag>}
    </div>
  );
};

export default VerifyVisitor;
