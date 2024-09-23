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
import { Chip } from "primereact/chip";

import { useNavigate } from "react-router-dom";

import endPoint from "./../../../services/endPoint";
import config from "./../../../services/config";

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

const Picklists = () => {
  const numOfRows = 7;
  const [start, setStart] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(numOfRows);
  const [totalRecords, setTotalRecords] = useState(numOfRows);
  const [picklists, setPicklists] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedPicklists, setSelectedPicklists] = useState(null);

  const initialState = {
    results: [],
    loading: true,
    sortField: null,
    sortOrder: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState, init);
  const { results, loading, sortField, sortOrder } = state;



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
        dispatch({ type: "dataLoaded", payload: picklists });
      }, 50);
    }
  }, [loading, sortField, sortOrder]);

  const list = (page, size, sort, cond) => {
    sort = sort == null ? "id" : sort;
    endPoint(
      config.picklistAPIs.listPage +
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
      setPicklists(res.content);
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



const onFilter= (event) => {
      console.log("-----event------", event.filters['name'].constraints);
          var cond = [];
            for(var key in event.filters['name'].constraints){
                  var value =event.filters['name'].constraints[key].value;
          if (value !== null && value !== undefined) {
            cond.push({ field: "name", operation: "like", value: '%'+value+'%'});
          }}
          list(0, numOfRows, null, cond);

}




  const onGlobalFilterChange = (e) => {
    console.log("===========", e);
    const value = e.target.value;
    setSearch(value);
    list(0, numOfRows, null, [
      { field: "name", operation: "like", value: "%" + value + "%" },
      { field: "description", operation: "like", value: "%" + value + "%" },
    ]);
  };

  const onPageChange = (event) => {
    console.log(event);
    list(event.page, event.rows, null, []);
  };


  const initFilters = () => {
    setFilters({
      "name": {
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
    navigate("/lcd/app/viewPicklist?id="+event.data.id);
    };

    const onRowUnselect = (event) => {
    console.log(event);
    };

  const itemBodyTemplate = (rowData) => {
  console.log("----------> ",rowData);
    return (
      <span className="font-semibold">
                    {rowData.pickListItems.map((item, index) => (
                      <Chip
                        key={index}
                        label={item.value}
                        style={{ marginInlineEnd: "5px" }}
                      />
                    ))}
                  </span>
    );
  };

  return (
    <div className="card">
      <DataTable resizableColumns
        value={picklists}
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
        emptyMessage="No picklists found."

        selectionMode="single" selection={selectedPicklists} onSelectionChange={(e) => setSelectedPicklists(e.value)}
        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false}
      >
        <Column field="code" header="Code" sortable></Column>

        <Column
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          filter
          field="name"
          header="Name"
        ></Column>
                 <Column
                          field="items"
                          header="Items"
                          body={itemBodyTemplate}
                        ></Column>
        <Column field="description" header="Description" ></Column>

      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={onPageChange}
      />


    </div>
  );
};

export default Picklists;
