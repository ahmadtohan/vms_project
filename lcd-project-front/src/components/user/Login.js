import React, { useState, useEffect ,useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Input } from "./../../custom/Input";

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
                          console.log(res);
                           EventBus.dispatch("handelUserLogged",res);
                           navigate("/lcd/app/users");

            }
            );

            
        }
    });  
    

    
  return (
           <div className="background" style={{backgroundImage: 'url("/lcd/wood.jpg")'}}>
          <div className="card" style={{width: '25%', marginTop:'10%'}}>

    <div className="flex flex-wrap gap-q  justify-content-center"  >
       
        <form onSubmit={formik.handleSubmit} >

           <Input name="username" type ="text" title="Username"  formik={formik} />
          <Input name="password" type ="password" title="Password"  formik={formik} />

    
    
    <Button type="submit" label="Login" />
                 
                        
    </form>

     </div>
       </div>
       </div>
  );
};

export default Login;
