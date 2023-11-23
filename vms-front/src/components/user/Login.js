import React, { useState, useEffect ,useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import userServices from "./../../services/userServices";
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
 import { useNavigate } from "react-router-dom";
 import { Toast } from 'primereact/toast';

 
const Login = () => {
      const toast = useRef(null);
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
       
            userServices.login(data).then(
                    (response) => {
                        console.log(response);
                     localStorage.setItem("user", JSON.stringify(response));    
                    navigate("/vms/app/visitors");

               
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
                  toast.current.show({severity: 'warn', summary: 'Rejected', detail: resMessage , life: 6000});
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
           <Toast ref={toast} />
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
