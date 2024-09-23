import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { SpeedDial } from 'primereact/speeddial';

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Input } from "./../../custom/Input";
import Utils from "./../../services/Utils";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const toast = useRef(null);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [roles, setRoles] = useState([]);
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
                              console.log("isAdmin",isAdmin);
                               if (!isAdmin && (!data.roles || !data.roles.length)) {
                                   errors.roles = "roles are required.";
                                  }

      console.log("data , err: ",data, errors);
      return errors;
    },
    onSubmit: (data) => {
      const obj = Object.assign({},data);
      setMessage("");
      obj.birthDate = Utils.formatDate(obj.birthDate);
      endPoint(config.userAPIs.create, "POST", obj).then((res) => {
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
               <Input name="fullName" type ="text" title="Full Name"  formik={formik} />

               <Input name="email" type ="text" title="Email"  formik={formik} />

              <Input name="eid" type ="mask" mask="999-9999-9999999-9" title="E-ID"  formik={formik} />

               <Input name="birthDate" type ="calendar" title="Birth Date"  formik={formik} />

               <Input name="gender" type ="dropdown" title="Gender"  value={formik.values["gender"]}
                                                               onChange={(e) => {
                                                                 formik.setFieldValue("gender", e.value);
                                                               }}
                  options={genders}  optionLabel="label"  placeholder="Select Gender" formik={formik} />

            </div>


            <div className="flex align-items-center">

      <Input name="username" type ="text" title="Username"  formik={formik} />
       <Input name="password" type ="password" title="Password"  formik={formik} />

     <Input name="type" type ="dropdown" title="Type"  value={formik.values["type"]}
                                                  onChange={(e) => {
                                                            formik.setFieldValue("type", e.value);
                                                          setIsAdmin(e.value=="ADMIN"?true:false);

                                                               }}
                  options={types}  optionLabel="label"  placeholder="Select Type" formik={formik} />


  {!isAdmin &&
   <Input name="roles" type ="autoComplete" field="name" value={formik.values["roles"]}
   title="Roles" multiple="true" suggestions={filteredRoles} completeMethod={search}
   onChange={(e) => { formik.setFieldValue("roles", e.value);}} formik={formik} />}


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
