import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { SpeedDial } from "primereact/speeddial";
import { Chip } from "primereact/chip";
import { Show } from "./../../custom/Show";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";

const ViewRole = () => {
  const navigate = useNavigate();
  const id = new URLSearchParams(window.location.search).get("id");
  const [role, setRole] = useState({
    status: {},
    permissions: [{endpoint:{}}],
  });

  useEffect(() => {
    endPoint(config.roleAPIs.view + "/" + id, "GET", null).then(
      (res) => {
        setRole(res);
      },
      (error) => {}
    );
  }, []);

  const redirectItems = [
    {
      label: "Add",
      icon: "pi pi-pencil",
      command: () => {
        navigate("/lcd/app/editRole");
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
      name: {
        label: "Name",
        icon: "pi pi-user",
      },
         status: {
               isTag: true,
               subKey: "label",
               label: "Status",
               icon: "pi pi-bookmark",
             },

      description: {
        label: "Description",
        icon: "pi pi-bookmark",
      }
    }

  };

  return (
    <div className="card">
       <Show rows={rows} object={role} severityByStatus={getSeverityByStatus} />

      <div className="flex align-items-center gap-3" style={{marginInlineStart: '15%'}}>
        <div style={{ margin: "20px" }}>
          <span className="flex align-items-center gap-2">
            <i className="pi pi-bars"></i>
            <span className="font-semibold">
              {role.permissions.map((permission, index) => (
                <Chip
                  key={index}
                  label={permission.endpoint.api}
                  style={{ marginInlineEnd: "5px" }}
                />
              ))}
            </span>
          </span>
          <small>Permissions</small>
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

export default ViewRole;
