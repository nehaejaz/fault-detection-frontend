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
  const [dataLoaded, setDataLoaded] = useState(false);
  const [header, setHeader] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [csvFile, setCsvFile] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [lengthOfCsv, setLengthOfCsv] = useState(0);
  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data
  const [tabNames, setTabNames] = useState([]);
  const [data, setStructureData] = useState([]);
  //TODO: Auto generate this array
  const comps = ["master-dataset.csv", "mc9-all.csv", "mv27-all.csv"];
  let child = [];
  useEffect(() => {
    console.log(dataLoaded);
    if (csvFile.length == lengthOfCsv && dataLoaded == false) {
      // console.log("csvfile", csvFile);
      csvFile.forEach((item, i) => {
        pasrseCsvData(i);
        // let underSampledFiles = csvFile.filter((item) => item.fileName.includes("-us"))
        // underSampledFiles.forEach(item => {
        //   let trainingSets = csvFile.filter((item) => item.fileName.includes(item))
        //   item.name ="neha"
        // })
        // console.log("after",array)
      });
      // setDataLoaded(true)
    }
  }, [csvFile]);

  useEffect(() => {
    if (csvData.length == lengthOfCsv) {
      structureData(csvData);
    }
  }, [csvData]);

  // **** Handlers ****
  const pasrseCsvData = (i) => {
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
          let obj = { fileName: csvFile[i].fileName, rowData: [valuesArray] };
          setCsvData((prev) => [
            ...prev,
            { fileName: csvFile[i].fileName, rowData: [valuesArray] },
          ]);
          // setCsvData(obj);
          // return obj
        },
      }
    );
    //To stop rerendering of the component
    if (i == csvFile.length - 1) {
      setDataLoaded(true);
    }
  };

  const structureData = (data) => {
    data.forEach((el) => {
      if (el.fileName == "master-dataset.csv") {
        console.log("hello neha")
        setStructureData((prev) => [
          ...prev,
          
            {
              component: "master",
              child: [{
                all: [el]
              }],
            },
          
        ]);
      } else if (el.fileName == "mc9-all.csv") {
        let comp = "mc9";
        let mc9 = data.filter((item) => item.fileName.includes("mc9"));
        let all = mc9.filter((item) => item.fileName.includes("all"));
        let train = mc9.filter((item) => item.fileName.includes("set"));
        let sample = mc9.filter((item) => item.fileName.includes("us"))

        setStructureData((prev) => [
          ...prev,
          
            {
              component: "mc9",
              child: [{
                all: all,
                train: train,
                samples: [sample],
              }],
            },
          
        ]);
      } else if (el.fileName == "mc27-all.csv") {
        let comp = "mc27";
        let mc27 = data.filter((item) => item.fileName.includes("mc27"));
        let all = mc27.filter((item) => item.fileName.includes("all"));
        let train = mc27.filter((item) => item.fileName.includes("set"));
        let sample = mc27.filter((item) => item.fileName.includes("us"))
        setStructureData((prev) => [
          ...prev,
          
            {
              component: "mc27",
              child: [{
                all: all,
                train: train,
                samples: [sample],
              }],
            },
          
        ]);
      }
    });
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
      {data.length > 0? (
        <>
          <div
            className="bg-primary"
            style={{
              padding: "1%",
              color: "white",
              textAlign: "center",
              marginBottom: "5%",
            }}
          >
            <h4>Axiom Images Data</h4>
          </div>
          <CustomTab tabNames={tabNames} header={header} data={data} />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
