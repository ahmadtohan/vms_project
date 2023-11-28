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

const Visitors = () => {
  const numOfRows = 7;
  const [start, setStart] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(numOfRows);
  const [totalRecords, setTotalRecords] = useState(numOfRows);
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedVisitors, setSelectedVisitors] = useState(null);

  const initialState = {
    results: [],
    loading: true,
    sortField: null,
    sortOrder: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState, init);
  const { results, loading, sortField, sortOrder } = state;

  const [statuses] = useState(["Pending", "Approved", "Cancelled"]);
  const statusesMap = {
    Pending: "PENDING",
    Approved: "APPROVED",
    Cancelled: "CANCELLED",
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
        dispatch({ type: "dataLoaded", payload: visitors });
      }, 50);
    }
  }, [loading, sortField, sortOrder]);

  const list = (page, size, sort, cond) => {
    sort = sort == null ? "id" : sort;
    endPoint(
      config.visitorAPIs.listPage +
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
      setVisitors(res.content);
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
  ///////////////

  const onApprove = (r) => {
    var entity = {
      id: r.id,
      status: "APPROVED",
    };

    endPoint(config.visitorAPIs.update, "POST", entity).then((res) => {});
    window.location.reload();
  };

  const onCancel = (r) => {
    var entity = {
      id: r.id,
      status: "CANCELLED",
    };
    endPoint(config.visitorAPIs.update, "POST", entity).then((res) => {});
    window.location.reload();
  };

  const handleApproveAndCancel = (r) => {
    return (
      <div style={{ display: "flex" }}>
        {r.status.value == "PENDING" && (
          <Button
            type="button"
            icon="pi pi-check"
            className="p-button p-component p-button-success"
            style={{ marginRight: ".3em" }}
            onClick={() => onApprove(r)}
          ></Button>
        )}
        {r.status.value == "PENDING" && (
          <Button
            type="button"
            icon="pi pi-times"
            className="p-button p-component p-button-warning"
            style={{ marginRight: ".3em" }}
            onClick={() => onCancel(r)}
          ></Button>
        )}
      </div>
    );
  };

  const getSeverityByStatus = (statusVal) => {
    switch (statusVal) {
      case "Approved":
        return "success";

      case "Pending":
        return "warning";

      case "Cancelled":
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


  const statusFilterCallback = (e, options) => {
    var cond = [];

    if (e.value !== undefined) {
      console.log("-----------", e);
      cond = [{ field: "status", operation: "=", value: statusesMap[e.value] }];
    }
    options.filterCallback(e.value, options.index);
    list(0, numOfRows, null, cond);
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverityByStatus(option)} />;
  };
  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => statusFilterCallback(e, options)}
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
    navigate("/vms/app/viewVisitor?id="+event.data.id);
    };

    const onRowUnselect = (event) => {
    console.log(event);
    };

  const redirectItems = [
    {
      label: "Add",
      icon: "pi pi-pencil",
      command: () => {
        navigate("/vms/app/addVisitor");
      },
    }
    ,
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {},
        },
    {
      label: "Update",
      icon: "pi pi-refresh",
      command: () => {
        window.location.reload();
      },
    }
  ];

  return (
    <div className="card">
      <DataTable
        value={visitors}
        dataKey="id"
        header={header}
        filterDisplay="menu"
        filters={filters}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(event) => {
          dispatch({ type: "onSortingChanged", payload: event });
        }}
        emptyMessage="No visitors found."
        tableStyle={{ minWidth: "100rem" }}
        selectionMode="single" selection={selectedVisitors} onSelectionChange={(e) => setSelectedVisitors(e.value)}
        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false}
      >
        <Column field="fullName" header="Full Name"></Column>
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
        <Column field="fromDate" header="from Date" sortable></Column>
        <Column field="toDate" header="to Date" sortable></Column>
        <Column
          header="Approve / Cancel"
          body={handleApproveAndCancel}
          style={{ textAlign: "center", width: "4em" }}
        />

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
          model={redirectItems}
          direction="up" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined"
          style={{ right: "2rem", bottom: "2rem", position: "fixed" }}
          buttonClassName="p-button-help"
        />
      </div>
    </div>
  );
};

export default Visitors;
