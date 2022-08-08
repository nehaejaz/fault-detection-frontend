import "./App.css";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
import CustomTab from "./components/CustomTab";

const App = () => {
  const [parsedData, setParsedData] = useState([]);
  const [header, setHeader] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [csvFile, setCsvFile] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [lengthOfCsv, setLengthOfCsv] = useState(0);
  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data
  const [tabNames, setTabNames] = useState([]);

  useEffect(() => {
    if (csvFile.length == lengthOfCsv) {
      console.log(csvFile);
      csvFile.forEach((item, i) => {
        pasrseCsvData(i);
      });
    }
  }, [csvFile]);

  useEffect(() => {
    console.log("csvData=>", csvData);
  }, [csvData]);

  // **** Handlers ****
  const pasrseCsvData = (i) => {
    console.log("index", csvFile[i].fileName);

    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(
      // event.target.files[0],
      csvFile[i].downloadUrl,
      // "https://firebasestorage.googleapis.com/v0/b/thesis-project-b7707.appspot.com/o/csv-files%2Fmaster-dataset.csv?alt=media&token=1fa6b74c-b180-41c9-9ae1-4a9def4827ae",
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
          // rowsArray.splice(index, 1, "Id");

          // Parsed Data Response in array format
          setParsedData(results.data);

          // Set Column Names
          setHeader(rowsArray);

          //Set Values
          setRowData(valuesArray);
          setCsvData((prev) => [
            ...prev,
            { fileName: csvFile[i].fileName, rowData: [valuesArray] },
          ]);
        },
      }
    );
  };

  // List CSV Files from Firebase Storage
  const listItem = () => {
    const storageRef = ref(storage, `/csv-files`);
    listAll(storageRef).then((res) => {
      console.log("res=>", res.items.length);
      setLengthOfCsv(res.items.length);
      res.items.forEach((item) => {
        let fileName = item._location.path.split("/");
        fileName = fileName[1];
        getDownloadURL(ref(storage, item._location.path))
          .then((url) => {
            setCsvFile((prev) => [
              ...prev,
              { fileName: fileName, downloadUrl: url },
            ]);
            setTabNames((prev) => [...prev, item.name]);
          })
          .catch((error) => {
            // Handle any errors
          });
      });
    });
  };

  return (
    <div>
      {csvFile.length === 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="primary"
            className="m-3"
            onClick={listItem}
          >
            Show CSV Files
          </Button>
        </div>
      )}

      {/* <Button type="submit" variant="primary" onClick={changeHandler}>
       show
      </Button> */}
      {csvData && csvFile ? (
        <CustomTab tabNames={tabNames} header={header} data={csvData} />
      ) : (
        "hello"
      )}
    </div>
  );
};

export default App;
