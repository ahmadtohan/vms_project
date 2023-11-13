/*import React, { useState, useRef } from "react";
 import { useNavigate } from "react-router-dom";
 import Form from "react-validation/build/form";
 import { InputText } from "primereact/inputtext";
 import { Button } from 'primereact/button';
 import CheckButton from "react-validation/build/button";
 import { useFormik } from 'formik';
 import { Toast } from 'primereact/toast';
 import { classNames } from 'primereact/utils';
 
 import AuthService from "../services/auth.service";
 
 const required = (value) => {
 if (!value) {
 return (
 <div className="invalid-feedback d-block">
 This field is required!
 </div>
 );
 }
 };
 
 const Login = () => {
 const form = useRef();
 const checkBtn = useRef();
 
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState("");
 
 const navigate = useNavigate();
 const toast = useRef(null);
 
 const show = () => {
 toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: formik.values.value });
 };
 const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);
 
 const getFormErrorMessage = (name) => {
 return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
 };
 
 const onChangeUsername = (e) => {
 const username = e.target.value;
 setUsername(username);
 };
 
 const onChangePassword = (e) => {
 const password = e.target.value;
 setPassword(password);
 };
 
 const handleLogin = (e) => {
 e.preventDefault();
 
 setMessage("");
 setLoading(true);
 
 form.current.validateAll();
 
 if (checkBtn.current.context._errors.length === 0) {
 AuthService.login(username, password).then(
 () => {
 navigate("/profile");
 window.location.reload();
 },
 (error) => {
 const resMessage =
 (error.response &&
 error.response.data &&
 error.response.data.message) ||
 error.message ||
 error.toString();
 
 setLoading(false);
 setMessage(resMessage);
 }
 );
 } else {
 setLoading(false);
 }
 };
 
 const formik = useFormik({
 initialValues: {
 value: ''
 },
 validate: (data) => {
 let errors = {};
 
 if (!data.value) {
 errors.value = 'Name - Surname is required.';
 }
 
 return errors;
 },
 onSubmit: (data) => {
 data && show(data);
 formik.resetForm();
 }
 });
 return (
 <div className="col-md-12">
 <div className="card card-container">
 <img
 src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
 alt="profile-img"
 className="profile-img-card"
 />
 
 <Form onSubmit={handleLogin} ref={form}>
 <div className="form-group">
 <label htmlFor="username">Username</label>
 <Toast ref={toast} />
 <InputText 
 id="username"
 name="username"
 value={formik.values.value}
 onChange={(e) => {
 formik.setFieldValue('username', e.target.value);
 }}
 className={classNames({ 'p-invalid': isFormFieldInvalid('username') })}
 />
 {getFormErrorMessage('username')}
 </div>
 
 <div className="form-group">
 <label htmlFor="password">Password</label>
 <InputText
 type="password"
 className="form-control"
 name="password"
 value={password}
 onChange={onChangePassword}
 validations={[required]}
 />
 </div>
 
 <div className="form-group"  style={{marginTop: '13px'}}  >
 <Button className="btn btn-primary btn-block" disabled={loading}>
 {loading && (
 <span className="spinner-border spinner-border-sm"></span>
 )}
 <span>Login</span>
 </Button>
 </div>
 
 {message && (
 <div className="form-group">
 <div className="p-error alert alert-danger" role="alert">
 {message}
 </div>
 </div>
 )}
 <CheckButton style={{ display: "none" }} ref={checkBtn} />
 </Form>
 </div>
 </div>
 );
 };*/



import React, { useRef ,useState} from "react";
import { useFormik } from 'formik';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
 import AuthService from "../services/auth.service";
 import { useNavigate } from "react-router-dom";
 
export default function Login() {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.username) {
                errors.username = 'username is required.';
            }
            if (!data.password) {
                errors.password = 'password is required.';
            }
            return errors;
        },
        onSubmit: (data) => {
            console.log("=====================222222222222========",formik.errors==null);

           setMessage("");
            AuthService.login(data.username, data.password).then(
                    () => {
                navigate("/profile");
                window.location.reload();
            },
                    (error) => {
                const resMessage =
                        (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                        error.message ||
                        error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
            );
       
            
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };




    return (
            <div className="card flex flex-wrap gap-q justify-content-center" style={{width: '25%'}}>
                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                    <span className="p-float-label">
                        <InputText 
                            id="username"
                            name="username"
                            value={formik.values.value}
                            onChange={(e) => {
                                    formik.setFieldValue('username', e.target.value);
                                }}
                            className={classNames({'p-invalid': isFormFieldInvalid('username')})}
                            />
                        <label htmlFor="input_username">Username</label>
                    </span>
                    {getFormErrorMessage('username')}
            
                    <span className="p-float-label">
                        <InputText
                            id="password"
                            name="password"
                            password={formik.values.value}
                            onChange={(e) => {
                                    formik.setFieldValue('password', e.target.value);
                                }}
                            className={classNames({'p-invalid': isFormFieldInvalid('password')})}
                            />
                        <label htmlFor="input_password">Password</label>
                    </span>
                    {getFormErrorMessage('password')}
            
                    <Button type="submit" label="Submit" />
                    {message && (
                            <div className="form-group">
                                <div className="p-error alert alert-danger" role="alert">
                                    {message}
                                </div>
                            </div>
                                )}
                </form>
            </div>
            )
}