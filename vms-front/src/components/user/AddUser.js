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
import { SpeedDial } from 'primereact/speeddial';

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const toast = useRef(null);
  const [user, setUser] = useState({});
  const [fdate, setFdate] = useState(null);
  const [tdate, setTdate] = useState(null);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [roles, setRoles] = useState([]);
   const [selectedRoles, setSelectedRoles] = useState(null);
  const [filteredRoles, setFilteredRoles] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

      endPoint(
        config.roleAPIs.activeRoles,
        "GET",
        null
      ).then((res) => {
        console.log(res);
        setRoles(res);
             }
        );
  }, []);

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredRoles;

            if (!event.query.trim().length) {
                filteredRoles = [...roles];
            }
            else {
                _filteredRoles = roles.filter((role) => {
                    return role.name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredRoles(_filteredRoles);
        }, 50);
    }

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      password: "",
      email: "",
      eid: "",
      birthDate: "",
      type: "",
       gender: "",
       roles: [],
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

      if (!data.birthDate) {
        errors.birthDate = "birthDate is required.";
      }
      if (!data.username) {
              errors.username = "username is required.";
            }
            if (!data.password) {
                    errors.password = "password is required.";
                  }
                  if (!data.type) {
                          errors.type = "type is required.";
                        }
                        if (!data.gender) {
                                errors.gender = "gender is required.";
                              }
                              data.roles=selectedRoles;
                              console.log("isAdmin",isAdmin);
                               if (!isAdmin && (!data.roles || !data.roles.length)) {
                                                              errors.roles = "roles are required.";
                                  }

      console.log("data , err: ",data, errors);
      return errors;
    },
    onSubmit: (data) => {

      setMessage("");
      data.birthDate = formatDate(data.birthDate);
      endPoint(config.userAPIs.create, "POST", data).then((res) => {
        console.log(res);
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "User has been created",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/vms/app/users");
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

  const types = [
    { value: "ADMIN", label: "Admin" },
    { value: "NORMAL", label: "Normal" },
  ];

 const genders = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  return (
    <div className="card">
      <Toast ref={toast} />
      <Tag severity="success" style={{marginBottom:'40px'}} value="Add User: "></Tag>

      <form onSubmit={formik.handleSubmit}>

            <div className="flex align-items-center">
              <span className="p-float-label  align-items-center gap-2 input-margin">
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

              <span className="p-float-label  align-items-center gap-2 input-margin">
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

              <span className="p-float-label  align-items-center gap-2 input-margin">
                <InputMask
                  id="eid"
                  name="eid"
                  value={formik.values.value}
                  mask="999-9999-9999999-9"
                  onChange={(e) => {
                    formik.setFieldValue("eid", e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("eid"),
                  })}
                />
                <label htmlFor="eid">E-ID</label>
                <div>{getFormErrorMessage("eid")}</div>
              </span>

              <span
                className="p-float-label  align-items-center gap-2 input-margin"
              >
                <Calendar
                  id="birthDate"
                  name="birthDate"
                  dateFormat="yy-mm-dd"
                  value={formik.values.value}
                  onChange={(e) => {
                    formik.setFieldValue("birthDate", e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("birthDate"),
                  })}
                />
                <label htmlFor="birthDate">birth Date</label>
                <div>{getFormErrorMessage("birthDate")}</div>
              </span>

                <span className="p-float-label  align-items-center gap-2 input-margin">
                                            <Dropdown
                                              id="gender"
                                              name="gender"
                                              value={selectedGender}
                                              onChange={(e) => {
                                                setSelectedGender(e.value);
                                                formik.setFieldValue("gender", e.value);
                                              }}
                                              options={genders}
                                              optionLabel="label"
                                              placeholder="Select Gender"
                                              className={classNames(
                                                {
                                                  "p-invalid": isFormFieldInvalid("gender"),
                                                },
                                                "w-full md:w-14rem"
                                              )}
                                            />

                                            <label htmlFor="gender">Gender</label>
                                            <div>{getFormErrorMessage("gender")}</div>
                                          </span>
            </div>



            <div className="flex align-items-center">
              <span className="p-float-label  align-items-center gap-2 input-margin">
                <InputText
                  id="username"
                  name="username"
                  value={formik.values.value}
                  onChange={(e) => {
                    formik.setFieldValue("username", e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("username"),
                  })}
                />
                <label htmlFor="username">User Name</label>
                <div>{getFormErrorMessage("username")}</div>
              </span>

              <span className="p-float-label  align-items-center gap-2 input-margin">
                <InputText
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.value}
                  onChange={(e) => {
                    formik.setFieldValue("password", e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("password"),
                  })}
                />
                <label htmlFor="password">Password</label>
                <div>{getFormErrorMessage("password")}</div>
              </span>

              <span className="p-float-label  align-items-center gap-2 input-margin">
                <Dropdown
                  id="type"
                  name="type"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.value);
                    formik.setFieldValue("type", e.value);
                    setIsAdmin(e.value=="ADMIN"?true:false);
                  }}
                  options={types}
                  optionLabel="label"
                  placeholder="Select a Type"
                  className={classNames(
                    {
                      "p-invalid": isFormFieldInvalid("type"),
                    },
                    "w-full md:w-14rem"
                  )}
                />

                <label htmlFor="type">Type</label>
                <div>{getFormErrorMessage("type")}</div>
              </span>

  {!isAdmin && <span className="p-float-label  align-items-center gap-2 input-margin">
                               <AutoComplete  id="roles"
                                      name="roles"
                                         field="name" multiple value={selectedRoles}
                               suggestions={filteredRoles} completeMethod={search}
                                onChange={(e) => {setSelectedRoles(e.value); }}

                                  className={classNames(
                                                                   {
                                                                     "p-invalid": isFormFieldInvalid("roles"),
                                                                   },
                                                                   "w-full md:w-14rem"
                                                                 )}
                                                                 />


                              <label htmlFor="roles">Roles</label>
                              <div>{getFormErrorMessage("roles")}</div>
                            </span>}


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

export default AddUser;
