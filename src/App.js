import "./App.css";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { storage } from "./fbConfig";
import { ref, listAll, getDownloadURL } from "firebase/storage";

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
  const [csvUrl, setCsvUrl] = useState([{ urlPath: "", downloadUrl: "" }]);
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
    console.log("csvUrl", csvUrl);
  }, [csvUrl]);

  // **** Handlers ****
  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(
      event.target.files[0],
      {
        download: true,
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
      }
    );
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
  // List CSV Files from Firebase Storage
  const listItem = () => {
    const storageRef = ref(storage, `/csv-files`);
    listAll(storageRef).then((res) => {
      res.items.forEach((item) => {
        console.log("item=>", item._location.path);
        setCsvUrl((prev) => [{ ...prev, urlPath: item._location.path }]);
      });
    });

    getDownloadURL(ref(storage, "/csv-files/master-dataset.csv"))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        console.log("url=>", url);
        setCsvUrl((prev) => [{ ...prev, downloadUrl: url }]);
        // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = "blob";
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open("GET", url);
        // xhr.send();

        // Or inserted into an <img> element
        // const img = document.getElementById("myimg");
        // img.setAttribute("src", url);
      })
      .catch((error) => {
        // Handle any errors
      });

    // storage.ref()
    //   .child("csv-files/")
    //   .listAll()
    //   .then((res) => {
    //     console.log("res=>", res);
    //     res.items.forEach((item) => {
    //       setData(arr => [...arr, item.name]);
    //     })
    //   })
    //   .catch((err) => {
    //     alert(err.message);
    //   });
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
      <Button type="submit" variant="primary" onClick={listItem}>
        List Files
      </Button>
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
