import React, { useState, useEffect ,useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
 import { useNavigate } from "react-router-dom";

import config from "./../services/config";

const Visitor = () => {
  const [visitors,setVisitors] = useState([]);
 const toast = useRef(null);
   const navigate = useNavigate();

  useEffect(() => {
    config.visitors().then(
      (response) => {
        setVisitors(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        setVisitors(_content);
      }
    );
  }, []);
  
    const onApprove = (r) => {
    var entity ={
         id:r.id,
          status:'APPROVED'
     }
    config.editVisitor(entity);
    console.log("Edit clicked" , r);
      window.location.reload();
  }
  
   const onCancel = (r) => {
    
     var entity ={
         id:r.id,
          status:'CANCELLED'
     }
    config.editVisitor(entity);
    console.log("Edit clicked" , r);
      window.location.reload();
  }
  
  const handle = (r) => {
      
     return (
      <div  style={{ display: "flex" }}>
       {r.status.value=='PENDING' && <Button
          type="button"
          icon="pi pi-check"
          className="p-button-label p-c"
          style={{ marginRight: ".3em" }}
          onClick={() => onApprove(r)}
        ></Button>}
        {r.status.value=='PENDING' && <Button
          type="button"
          icon="pi pi-times"
          className="p-button p-component p-button-warning"
          style={{ marginRight: ".3em" }}
          onClick={() => onCancel(r)}
        ></Button>}
      </div>
    );
  };
  
  
  const statusBodyTemplate = (rowData) => {
      if(rowData.status.value=='CANCELLED')
        return <span style={{ backgroundColor: '#ffd8b2' }}>{rowData.status.label}</span>;
          if(rowData.status.value=='APPROVED')
        return <span style={{ backgroundColor: '#8aff60' }}>{rowData.status.label}</span>;
    if(rowData.status.value=='PENDING')
        return <span style={{ backgroundColor: '#f0b2ff' }}>{rowData.status.label}</span>;
    }
 

    const items = [
        {
            label: 'Add',
            icon: 'pi pi-pencil',
            command: () => {
                 navigate("/AddVisitor");
            }
        },
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                 window.location.reload();
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
               
            }
        }
    ];

  return (
    <div className="card" >
       
      <DataTable value={visitors} paginator rows={7} rowsPerPageOptions={[10, 25, 50]} tableStyle={{ minWidth: '100rem' }}>
    <Column field="fullName" header="Full Name"></Column>
    <Column field="email" header="Email"></Column>
    <Column field="eid" header="E-ID"></Column>
    <Column  field="status.label" header="Status" sortable body={statusBodyTemplate}></Column>
    <Column field="fromDate" header="from Date" sortable ></Column>
    <Column field="toDate" header="to Date" sortable ></Column>
  <Column header="Approve / Cancel"body={handle} style={{ textAlign: "center", width: "4em" }}
            />
   
</DataTable>
      
       <div style={{ height: '300px' }} className="flex align-items-center justify-content-center">
                <Toast ref={toast} />
                <SpeedDial model={items} radius={120} type="quarter-circle" direction="up-left" style={{ right: 0, bottom: 0 }} buttonClassName="p-button-help" />
            </div>
    </div>
  );
};

export default Visitor;
