import React, { useState, useEffect ,useRef } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputMask } from "primereact/inputmask";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
 import { useNavigate } from "react-router-dom";


const VerifyVisitor = () => {

  const navigate = useNavigate();
 const queryParameters = new URLSearchParams(window.location.search);
  const accessKey = queryParameters.get("accessKey");
  const [verify, setVerify] = useState(false);
const [visitor, setVisitor] = useState();

  useEffect(() => {

endPoint(config.visitorAPIs.verify +"/"+accessKey,"GET" ,null).then((res)=>{
console.log("=====",res);
setVisitor(res);
setVerify(true);
},(error)=>{
console.log("==error===",error);
});

  }, []);


  return (
          <div className="card" >
        {verify && <h3> <Button icon="pi pi-check" severity="success" aria-label="Verified" />   Verified </h3> }

       {!verify &&  <h3><Button icon="pi pi-times" severity="danger" aria-label="Rejected" />  Rejected</h3>}

        {verify && visitor && <div className="flex flex-column xl:flex-column xl:align-items-start p-4 gap-4 justify-content-center">
        <Tag severity="info" value={visitor.fullName} rounded></Tag>
        <Tag severity="info" value={visitor.eid} rounded></Tag>
        <Tag severity="info" value={visitor.email} rounded></Tag>
        <Tag severity="success" value={visitor.fromDate} rounded></Tag>
        <Tag severity="warning" value={visitor.toDate} rounded></Tag>
        </div>}

    </div>
  );
};

export default VerifyVisitor;
