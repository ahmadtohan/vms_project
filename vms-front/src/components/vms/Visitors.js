import React, { useState, useEffect ,useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';

 import { useNavigate } from "react-router-dom";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

const Visitors = () => {
  const [visitors,setVisitors] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [filters, setFilters] = useState({});
    
    const [statuses] = useState(['Pending', 'Approved', 'Cancelled']);

 const toast = useRef(null);
   const navigate = useNavigate();

  useEffect(() => {
      initFilters();
      endPoint(config.visitorAPIs.list ,"GET" ,null).then((res)=>{

        if(res.status=="SUCCESS"){
                    console.log(res);
                      setVisitors(res.data);
                  }
      });


  }, []);
  
    const onApprove = (r) => {
    var entity ={
         id:r.id,
          status:'APPROVED'
     }

    endPoint(config.visitorAPIs.update ,"POST" ,entity).then((res)=>{});
    console.log("Edit clicked" , r);
      window.location.reload();
  }
  
   const onCancel = (r) => {
    
     var entity ={
         id:r.id,
          status:'CANCELLED'
     }
        endPoint(config.visitorAPIs.update ,"POST" ,entity).then((res)=>{});
    console.log("Edit clicked" , r);
      window.location.reload();
  }
  
  const handle = (r) => {
      
     return (
      <div  style={{ display: "flex" }}>
       {r.status.value=='PENDING' && <Button
          type="button"
          icon="pi pi-check"
          className="p-button p-component p-button-success"
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
  
  
      const getSeverity = (statusVal) => {
          console.log(statusVal);
        switch (statusVal) {
            case 'Approved':
                return 'success';

            case 'Pending':
                return 'warning';

            case 'Cancelled':
                return 'danger';

            default:
                return null;
        }
    };
    
     const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status.label} severity={getSeverity(rowData.status.label)}></Tag>;
    };
    

 

    const items = [
        {
            label: 'Add',
            icon: 'pi pi-pencil',
            command: () => {
                 navigate("/vms/app/addVisitor");
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
      const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };
    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };
    
   const onGlobalFilterChange = (e) => {
            const value = e.target.value;
        let _filters = { ...filters };

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    



    
    const clearFilter = () => {
        initFilters();
    };
    
        const initFilters = () => {
        setFilters({
            
            'status.label': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

        });
        setGlobalFilterValue('');
    };
    
    
       const renderHeader = () => {
        return (
                  <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
            

        );
    };
        const header = renderHeader();
        
  return (
    <div className="card" >
       
      <DataTable value={visitors} paginator rows={7} dataKey="id"  globalFilter={globalFilterValue} header={header} 
      filters={filters} filterDisplay="menu" globalFilterFields={['fullName','email','eid','fromDate','toDate']}
                    emptyMessage="No visitors found." rowsPerPageOptions={[10, 25, 50]} tableStyle={{ minWidth: '100rem' }}>
    <Column  field="fullName" header="Full Name" ></Column>
    <Column field="email" header="Email"></Column>
    <Column field="eid" header="E-ID"></Column>
    <Column  filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }}  filter filterElement={statusFilterTemplate} field="status.label"  header="Status" sortable body={statusBodyTemplate}></Column>
    <Column field="fromDate" header="from Date" sortable ></Column>
    <Column field="toDate" header="to Date" sortable ></Column>
  <Column header="Approve / Cancel"body={handle} style={{ textAlign: "center", width: "4em" }}
            />
   
</DataTable>
      
       <div style={{ height: '300px' }} className="flex align-items-center justify-content-center">
                <Toast ref={toast} />
                <SpeedDial model={items} radius={120} type="quarter-circle" direction="up-left" style={{ right: '2rem', bottom: '2rem',position: 'fixed' }} buttonClassName="p-button-help" />
            </div>
    </div>
  );
};

export default Visitors;
