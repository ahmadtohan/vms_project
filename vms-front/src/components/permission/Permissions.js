import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Chip } from "primereact/chip";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

const Permissions = () => {
    const [filters, setFilters] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    useEffect(() => {
     endPoint(
          config.permissionAPIs.permissionlist,"GET",null
        ).then((res) => {
          console.log(res);

          setPermissions(res);
      setLoading(false);
        });


        initFilters();
    }, []);


  const roleBodyTemplate = (rowData) => {
  console.log("----------> ",rowData);
    return (
      <span className="font-semibold">
                    {rowData.roles.map((role, index) => (
                      <Chip
                        key={index}
                        label={role.name}
                        style={{ marginInlineEnd: "5px" }}
                      />
                    ))}
                  </span>
    );
  };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'api': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
        });
        setGlobalFilterValue('');
    };

 const hasPerBodyTemplate = (rowData) => {
        return <i style={{ color: rowData.hasPermission ?'green':'#F59E0B' }} className={classNames('pi', { 'true-icon pi-check-circle': rowData.hasPermission, 'false-icon pi-times-circle': !rowData.hasPermission })}></i>;
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
        <div className="card">
            <DataTable resizableColumns value={permissions} /*paginator*/ showGridlines rows={10} loading={loading} dataKey="api"
                    filters={filters} globalFilterFields={['api']} header={header}
                    emptyMessage="No customers found.">
                <Column field="api" header="api" sortable style={{ width: "6rem" }} />
                 <Column field="hasPermission" header="Has Permission" dataType="boolean"   body={hasPerBodyTemplate} sortable style={{ width: "3rem",textAlign: 'center' }} />
                 <Column
                          field="roles"
                          header="Roles"
                          body={roleBodyTemplate}
                          sortable
                        ></Column>
            </DataTable>
        </div>
    );
}

export default Permissions;