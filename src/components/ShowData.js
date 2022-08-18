import { useEffect, useRef, useState } from "react";

import CustomTable from "./CustomTable";
import { CustomPagination } from "./CustomPagination";
import { Formik, Form, FieldArray } from "formik";
import { Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { ButtonDiv } from "../styling/Style";

const ShowData = ({ header, data, fileName }) => {
  const [rowData, setRowData] = useState(data[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentRows, setCurrentRows] = useState([]);
  const [edit, setEdit] = useState(false);
  const [totalRows, setTotalRows] = useState();
  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  useEffect(() => {
    if (rowData.length > 0) {
      calculatePages();
    }
  }, [rowData]);

  useEffect(() => {
    calculatePages();
  }, [currentPage]);

  // Pagination Logic
  const calculatePages = () => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    setCurrentRows(rowData.slice(indexOfFirstRow, indexOfLastRow));
    setTotalRows(rowData.length);
    console.log("current rows", rowData.slice(indexOfFirstRow, indexOfLastRow));
  };

  //   Formik initial values
  const initialValues = {
    tableData: {
      tableRowValues: currentRows,
      tableColValues: header,
      oldValue: currentRows,
    },
  };

  //   console.log("current rows", currentRows)
  // **** Handlers ****

  const paginate = (number, prev) => {
    console.log(number);
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
        if (element[0] === item[0]) {
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
              {/* {console.log(values)} */}

              <FieldArray name="tableData">
                {({ insert, remove, push }) => (
                  <div>
                    {values.tableData.tableRowValues.length > 0 && (
                      <>
                        {/* <Button
                          type="submit"
                          variant="primary"
                          onClick={exportCSV}
                          style={{ float: "right", margin: "1%" }}
                        >
                          Export CSV
                        </Button> */}

                        <CSVLink
                          data={rowData}
                          headers={values.tableData.tableColValues}
                          filename={fileName}
                          className="hidden"
                          ref={csvLink}
                          target="_blank"
                        />
                        <CustomTable
                          values={values}
                          tableCols={header}
                          tableRows={currentRows}
                          edit={edit}
                          fileName={fileName}
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
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={exportCSV}
                    style={{ float: "right", margin: "1%" }}
                  >
                    Export CSV
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

export default ShowData;
