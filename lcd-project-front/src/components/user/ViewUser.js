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

const ViewUser = () => {
  const navigate = useNavigate();
  const id = new URLSearchParams(window.location.search).get("id");
  const [user, setUser] = useState({
    status: {},
    gender: {},
    type: {},
    roles: [{}],
  });

  useEffect(() => {
    endPoint(config.userAPIs.view + "/" + id, "GET", null).then(
      (res) => {
        setUser(res);
      },
      (error) => {}
    );
  }, []);

  const redirectItems = [
    {
      label: "Add",
      icon: "pi pi-pencil",
      command: () => {
        navigate("/lcd/app/editUser");
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
    },
  ];

  const getSeverityByStatus = (statusVal) => {
    switch (statusVal) {
      case "Active":
        return "success";

      case "Inactive":
        return "danger";

      default:
        return null;
    }
  };
  const rows = {
    1: {
      username: {
        label: "User Name",
        icon: "pi pi-user",
      },
      fullName: {
        label: "Full Name",
        icon: "pi pi-user",
      },
      email: {
        label: "Email",
        icon: "pi pi-bookmark",
      },
      mobileNumber: {
        label: "Mobile Number",
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
      },
    },

    2: {
      gender: {
        subKey: "label",
        label: "Status",
        icon: "pi pi-bookmark",
      },
      type: {
        subKey: "label",
        label: "Type",
        icon: "pi pi-bookmark",
      },
      birthDate: {
        label: "Birth Date",
        icon: "pi pi-calendar",
      },
    },
  };

  return (
    <div className="card">
      <Show rows={rows} object={user} severityByStatus={getSeverityByStatus} />

      <div className="flex align-items-center gap-3">
        <div style={{ margin: "20px" }}>
          <span className="flex align-items-center gap-2">
            <i className="pi pi-bars"></i>
            <span className="font-semibold">
              {user.roles.map((role, index) => (
                <Chip
                  key={index}
                  label={role.name}
                  style={{ marginInlineEnd: "5px" }}
                />
              ))}
            </span>
          </span>
          <small>Roles</small>
        </div>
      </div>

      <SpeedDial
        model={redirectItems}
        direction="up"
        transitionDelay={80}
        showIcon="pi pi-bars"
        hideIcon="pi pi-times"
        buttonClassName="p-button-outlined"
        style={{ right: "2rem", bottom: "2rem", position: "fixed" }}
        buttonClassName="p-button-help"
      />
    </div>
  );
};

export default ViewUser;
