import React, { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import config from "./../services/config";

const Visitor = () => {
  const [visitors,setVisitors] = useState([]);

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

  return (
    <div className="card" >
       
      <DataTable value={visitors} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
    <Column field="fullName" header="Full Name"></Column>
    <Column field="email" header="Email"></Column>
    <Column field="eid" header="E-ID"></Column>
    <Column field="status.label" header="Status"></Column>
    <Column field="fromDate" header="from Date" sortable ></Column>
    <Column field="toDate" header="to Date" sortable ></Column>
</DataTable>
      
    </div>
  );
};

export default Visitor;
