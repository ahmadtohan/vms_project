import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { SpeedDial } from 'primereact/speeddial';
import { Input } from "./../../custom/Input";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";

const AddRole = () => {
  const toast = useRef(null);
  const [role, setRole] = useState({});
  const [message, setMessage] = useState("");
  const [endpoints, setEndpoints] = useState([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

      endPoint(
        config.endpointAPIs.endpoints,
        "GET",
        null
      ).then((res) => {
        console.log(res);
        setEndpoints(res);
             }
        );
  }, []);

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredEndpoints;

            if (!event.query.trim().length) {
                filteredEndpoints = [...endpoints];
            }
            else {
                _filteredEndpoints = endpoints.filter((obj) => {
                    return obj.api.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredEndpoints(_filteredEndpoints);
        }, 50);
    }

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
       endpoints: [],
    },
    validate: (data) => {
      let errors = {};

      if (!data.name) {
        errors.name = "name is required.";
      }

            if (!data.endpoints || !data.endpoints.length){
              errors.endpoints = "endpoints are required.";
            }

      console.log("data , err: ",formik,data, errors);
      return errors;
    },
    onSubmit: (data) => {
      const obj = Object.assign({},data);
      setMessage("");
      obj.permissions=[];
      for(var point in obj.endpoints){
        obj.permissions.push({'endpoint':obj.endpoints[point]});
      }
      delete obj.endpoints;
      endPoint(config.roleAPIs.create, "POST", obj).then((res) => {
        console.log(res);
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "Role has been created",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/lcd/app/roles");
        }, "500");
      });
    },
  });



  return (
    <div className="card">
      <Toast ref={toast} />
      <Tag severity="success" style={{marginBottom:'40px'}} value="Add Role: "></Tag>

      <form onSubmit={formik.handleSubmit}>

            <div className="flex align-items-center">
            <Input name="name" type ="text" title="Name"  formik={formik} />
             <Input name="description" type ="text" title="Description"  formik={formik} />

  </div>


<div className="flex align-items-center">
 <Input name="endpoints" type ="autoComplete" field="api" value={formik.values["endpoints"]}
 title="Endpoints" multiple="true" suggestions={filteredEndpoints} completeMethod={search}
 onChange={(e) => { formik.setFieldValue("endpoints", e.value);}} formik={formik} />

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

export default AddRole;
