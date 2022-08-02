import "./App.css";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { storage } from "./fbConfig";
import CustomTable from "./components/CustomTable";
import paginationFactory from "react-bootstrap-table2-paginator";
import { CustomPagination } from "./components/CustomPagination";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import { Button } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import { ButtonDiv } from "./styling/Style";

const App = () => {
  const [parsedData, setParsedData] = useState([]);
  const [header, setHeader] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [edit, setEdit] = useState(false);
  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

// Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rowData.slice(indexOfFirstRow, indexOfLastRow);
  const totalRows = rowData.length;

  // Formik initial values
  const initialValues = {
    tableData: {
      tableRowValues: currentRows,
      tableColValues: header,
      oldValue: currentRows,
    },
  };

  useEffect(() => {
    console.log("rowdata", rowData);
  }, [rowData]);

  // **** Handlers ****
  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          valuesArray.push(Object.values(d));
        });
        rowsArray = Object.keys(results.data[0]);
        const index = rowsArray.indexOf(""); // 👉️  0
        rowsArray.splice(index, 1, "Id");

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Set Column Names
        setHeader(rowsArray);

        //Set Values
        setRowData(valuesArray);
      },
    });
  };
  const paginate = (number, prev) => {
    setCurrentPage(number);
  };
  const paginatePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const paginateNext = () => {
    // TODO:Add consition for max page number, the current page shouldn't increase from length of page numbers
    setCurrentPage(currentPage + 1);
  };
  const paginateFirst = () => {
    setCurrentPage(1);
  };
  const paginateLast = (lastPageNumber) => {
    setCurrentPage(lastPageNumber);
  };
  const updateData = (values) => {
    const updatedArray = values.tableData.tableRowValues.filter(
      (e) => values.tableData.oldValue.indexOf(e) === -1
    );
    let newArray = rowData;
    updatedArray.forEach((element, i) => {
      rowData.forEach((item, i) => {
        if (element[0] == item[0]) {
          console.log("new value =>", element);
          console.log("old value =>", item);
          newArray[i] = element;
          console.log(newArray);
          setRowData(newArray);
        }
      });
    });
  };
  const exportCSV = (values) => {
    console.log("export csv function");
    csvLink.current.link.click();
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      <br />
      <br />
      <div>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={async (values) => {
            console.log("submitted");
            console.log(values);
            updateData(values);
            // exportCSV(values);
          }}
        >
          {({ values, props }) => (
            <Form>
              {/* <FormObserver /> */}

              <FieldArray name="tableData">
                {({ insert, remove, push }) => (
                  <div>
                    {values.tableData.tableRowValues.length > 0 && (
                      <>
                        <Button
                          type="submit"
                          variant="primary"
                          onClick={exportCSV}
                          style={{ float: "right", margin: "1%" }}
                        >
                          Export CSV
                        </Button>
                        <CSVLink
                          data={rowData}
                          headers={values.tableData.tableColValues}
                          filename="dataset.csv"
                          className="hidden"
                          ref={csvLink}
                          target="_blank"
                        />
                        <CustomTable
                          values={values}
                          tableCols={header}
                          tableRows={currentRows}
                          edit={edit}
                        />
                      </>
                    )}
                  </div>
                )}
              </FieldArray>
              {rowData.length > 0 && (
                <ButtonDiv>
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ margin: "1%" }}
                  >
                    Save Changes
                  </Button>
                </ButtonDiv>
              )}
            </Form>
          )}
        </Formik>
      </div>

      {rowData.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomPagination
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
            paginate={paginate}
            paginatePrev={paginatePrev}
            paginateNext={paginateNext}
            paginateFirst={paginateFirst}
            paginateLast={paginateLast}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default App;
