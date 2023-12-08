import React, { useState, useEffect, useRef } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";

const AddRole = () => {
  const toast = useRef(null);
  const [role, setRole] = useState({});
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
   const [selectedEndpoints, setSelectedEndpoints] = useState(null);
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
        errors.fullName = "name is required.";
      }
          data.endpoints=selectedEndpoints;
            if (!data.endpoints || !data.endpoints.length){
              errors.endpoints = "endpoints are required.";
            }

      console.log("data , err: ",data, errors);
      return errors;
    },
    onSubmit: (data) => {

      setMessage("");
      data.permissions=[];
      for(var point in data.endpoints){
        data.permissions.push({'endpoint':data.endpoints[point]});
      }
      delete data.endpoints;
      endPoint(config.roleAPIs.create, "POST", data).then((res) => {
        console.log(res);
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "Role has been created",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/vms/app/roles");
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
      <Tag severity="success" value="Add Role: "></Tag>

      <form onSubmit={formik.handleSubmit}>

            <div className="gap-q justify-content-center">
              <span className="p-float-label" style={{ margin: "3%" }}>
                <InputText
                  id="name"
                  name="name"
                  value={formik.values.value}
                  onChange={(e) => {
                    formik.setFieldValue("name", e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("name"),
                  })}
                />
                <label htmlFor="name">Name</label>
                <div>{getFormErrorMessage("name")}</div>
              </span>

              <span className="p-float-label" style={{ margin: "3%" }}>
                <InputText
                  id="description"
                  name="description"
                  value={formik.values.value}
                  onChange={(e) => {
                    formik.setFieldValue("description", e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("description"),
                  })}
                />
                <label htmlFor="description">Description</label>
                <div>{getFormErrorMessage("description")}</div>
              </span>





  <span className="p-float-label" style={{ margin: "3%" }}>

                               <AutoComplete  id="endpoints"
                                      name="endpoints"
                                         field="api" multiple value={selectedEndpoints}
                               suggestions={filteredEndpoints} completeMethod={search}
                                onChange={(e) => {setSelectedEndpoints(e.value); }}

                                  className={classNames(
                                                                   {
                                                                     "p-invalid": isFormFieldInvalid("endpoints"),
                                                                   },
                                                                   "w-full md:w-14rem"
                                                                 )}
                                                                 />


                              <label htmlFor="endpoints">Endpoints</label>
                              <div>{getFormErrorMessage("endpoints")}</div>
                            </span>


               </div>


        <Button type="submit" label="Submit" />
      </form>
    </div>
  );
};

export default AddRole;
