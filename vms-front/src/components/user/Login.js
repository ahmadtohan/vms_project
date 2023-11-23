import React, { useState, useEffect ,useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
 import { useNavigate } from "react-router-dom";
 import EventBus from "./../../common/eventBus";

 
const Login = () => {
   const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
      

   
  }, []);
  
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

           setMessage("");
       console.log(config);
            endPoint(config.userAPIs.login ,"POST",data).then(
            (res)=>{
            console.log("--------",res);
                        if(res.status=="SUCCESS"){
                          console.log(res);
                           EventBus.dispatch("handelUserLogged",res.data);
                                            navigate("/vms/app/visitors");
                        }
            }
            );

            
        }
    });  
    
 

   const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };
    
  return (
          <div className="card" style={{width: '25%', marginTop:'10%'}}>

    <div className="flex flex-wrap gap-q  justify-content-center"  >
       
        <form onSubmit={formik.handleSubmit} >
      <span className="p-float-label" style={{ margin: "5%" }}>
      <InputText id="username" name="username" value={formik.values.value}
                            onChange={(e) => {
                                    formik.setFieldValue('username', e.target.value);
                                }}
                            className={classNames({'p-invalid': isFormFieldInvalid('username')})} />
       <label htmlFor="username">username</label>
        <div>{getFormErrorMessage('username')}</div>
    </span>
    

 <span className="p-float-label" style={{ margin: "5%" }}>
      <InputText id="email" name="password" type="password" value={formik.values.value}
                            onChange={(e) => {
                                    formik.setFieldValue('password', e.target.value);
                                }}
                            className={classNames({'p-invalid': isFormFieldInvalid('password')})} />
       <label htmlFor="password">Password</label>
       <div>{getFormErrorMessage('password')}</div>
    </span>
   
    
    
    
    <Button type="submit" label="Login" />
                 
                        
    </form>

     </div>
       </div>
  );
};

export default Login;
