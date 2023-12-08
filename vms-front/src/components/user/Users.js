import React, { useState, useEffect, useRef, useReducer } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";

import { useNavigate } from "react-router-dom";
import endPoint from "./../../services/endPoint";
import config from "./../../services/config";

const init = (initialState) => initialState;

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "onSortingChanged":
      return { ...state, ...payload, loading: true };
    case "dataLoaded":
      return { ...state, results: payload, loading: false };
    default:
      throw new Error();
  }
};

const Users = () => {
  const numOfRows = 7;
  const [start, setStart] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(numOfRows);
  const [totalRecords, setTotalRecords] = useState(numOfRows);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedUsers, setSelectedUsers] = useState(null);

  const initialState = {
    results: [],
    loading: true,
    sortField: null,
    sortOrder: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState, init);
  const { results, loading, sortField, sortOrder } = state;

  const [statuses] = useState(["Active", "Inactive"]);
  const statusesMap = {
    Active: "ACTIVE",
    Inactive: "INACTIVE"
  };

  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        if (sortField != null) {
          list(
            0,
            numOfRows,
            sortField + "," + (sortOrder == -1 ? "DESC" : "ASC"),
            []
          );
        } else {
          initFilters();
        }
        dispatch({ type: "dataLoaded", payload: users });
      }, 50);
    }
  }, [loading, sortField, sortOrder]);

  const list = (page, size, sort, cond) => {
    sort = sort == null ? "id" : sort;
    endPoint(
      config.userAPIs.listPage +
        "?page=" +
        page +
        "&size=" +
        size +
        "&sort=" +
        sort,
      "POST",
      cond
    ).then((res) => {
      console.log(res);

      setFirst(size * page);
      setRows(size);
      setTotalRecords(res.totalElements);
      setUsers(res.content);
      console.log(
        "=======first, size, cond====",
        size * page,
        size,
        totalRecords,
        res.totalElements
      );
    });
  };

  ////////////////////////////////////

  const getSeverityByStatus = (statusVal) => {
    switch (statusVal) {
      case "Active":
        return "success";

      case "Inactive":
        return "danger";

      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status.label}
        severity={getSeverityByStatus(rowData.status.label)}
      ></Tag>
    );
  };


const onFilter= (event) => {
      console.log("-----event------", event.filters['status.label'].constraints);
          var cond = [];
            for(var key in event.filters['status.label'].constraints){
                  var value =event.filters['status.label'].constraints[key].value;
          if (value !== null && value !== undefined) {
            cond.push({ field: "status", operation: "=", value: statusesMap[value] });
          }}
          list(0, numOfRows, null, cond);

}


  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverityByStatus(option)} />;
  };
  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) =>  options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    console.log("===========", e);
    const value = e.target.value;
    setSearch(value);
    list(0, numOfRows, null, [
      { field: "fullName", operation: "like", value: "%" + value + "%" },
      { field: "email", operation: "like", value: "%" + value + "%" },
      { field: "eid", operation: "like", value: "%" + value + "%" },
    ]);
  };

  const onPageChange = (event) => {
    console.log(event);
    list(event.page, event.rows, null, []);
  };


  const initFilters = () => {
    setFilters({
      "status.label": {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setSearch("");
    list(0, numOfRows, null, []);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={initFilters}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={search}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();


    const onRowSelect = (event) => {
    console.log(event);
    navigate("/vms/app/viewUser?id="+event.data.id);
    };

    const onRowUnselect = (event) => {
    console.log(event);
    };


  return (
    <div className="card">
      <DataTable resizableColumns
        value={users}
        dataKey="id"
        header={header}
        filterDisplay="menu"
        filters={filters}
         onFilter={onFilter}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(event) => {
          dispatch({ type: "onSortingChanged", payload: event });
        }}
        emptyMessage="No users found."

        selectionMode="single" selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false}
      >
        <Column field="fullName" header="Full Name" sortable></Column>
        <Column field="email" header="Email"></Column>
        <Column field="eid" header="E-ID"></Column>

        <Column
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          filter
          filterElement={statusFilterTemplate}
          field="status.label"
          header="Status"
          body={statusBodyTemplate}
        ></Column>
        <Column field="gender.label" header="Gender" ></Column>
        <Column field="type.label" header="Type" ></Column>


      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={onPageChange}
      />

      <div
        style={{ height: "300px" }}
        className="flex align-items-center justify-content-center"
      >

        <SpeedDial
             onClick={(e) => {
                        navigate("/vms/app/addUser");
                }}
          direction="up" transitionDelay={80} showIcon="pi pi-plus" hideIcon="pi pi-plus" buttonClassName="p-button-outlined"
          style={{ right: "2rem", bottom: "2rem", position: "fixed" }}
          buttonClassName="p-button-help"
        />
      </div>
    </div>
  );
};

export default Users;
