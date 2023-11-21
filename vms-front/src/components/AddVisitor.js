import React, { useState, useEffect ,useRef } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

import config from "./../services/config";

const AddVisitor = () => {
  const [visitor,setVisitor] = useState({});
  const [fdate, setFdate] = useState(null);
  const [tdate, setTdate] = useState(null);
  useEffect(() => {
   
   
  }, []);
  
    

  return (
    <div className="card flex flex-column md:flex-column gap-3" >
       
 <div className="p-inputgroup" style={{ maxWidth: '25%' }}>
    <Button label="Full Name" />
    <InputText  />
 </div>
   
    <div className="p-inputgroup" style={{ maxWidth: '25%' }}>
    <Button label="Email" />
    <InputText  />
 </div>
 
  <div className="p-inputgroup" style={{ maxWidth: '25%' }}>
    <Button label="E-ID" />
    <InputText  />
 </div>
 
 <div className="p-inputgroup" style={{ maxWidth: '25%' }}>
    <Button label="from Date" />
   <Calendar value={fdate} onChange={(e) => setFdate(e.value)} />
 </div>
 <div className="p-inputgroup" style={{ maxWidth: '25%' }}>
    <Button label="to Date" />
    <Calendar value={tdate} onChange={(e) => setTdate(e.value)} />
 </div>
 
 
 <Button icon="pi pi-check" severity="success" label="Submit" style={{ maxWidth: '25%' }}/>
    </div>
  );
};

export default AddVisitor;
