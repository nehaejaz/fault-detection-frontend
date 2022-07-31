import { Table, Button } from "react-bootstrap";
import { Field, Formik } from "formik";
import { useState } from "react";
import { ImageTd, Label, Span, SpanLable, Td, Tr } from "../styling/Style";

const CustomTable = ({ tableCols, tableRows, values }) => {
  // const [edit, setEdit] = useState(false);

  // const editHandler = () => {
  //   setEdit(true);
  // };
  // const saveHandler = () => {
  //   setEdit(false);
  // };
  return (
    <>
      <Table bordered hover>
        <thead>
          <tr className="text-center">
            {tableCols.map((rows, index) => {
              return <th key={index}>{rows}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((value, index) => {
            return (
              <Tr
                backgroundColor={
                  values.tableData.tableRowValues[index][2] == 1
                    ? "#008000ab"
                    : "#ff0808b0"
                }
              >
                <Td>{value[0]}</Td>
                <ImageTd className="w-50">
                  <img
                    src={`./dataset/${value[3]}/all/${value[1]}`}
                    className="w-75"
                  />
                </ImageTd>
                <Td>
                 
                    <label style={{width:"100px"}}>
                      <span>
                        <Field
                        style={{ 
                          width: "20%",
                          height: "20px",
                          border: "0px"
                        }}
                          type="radio"
                          name={`tableData.tableRowValues.${index}.[2]`}
                          value="0"
                        />
                      </span>

                      <span>&nbsp; 0 - Bad</span>
                    </label>
                  
                 
                    <label style={{width:"190px"}}>
                      <span>
                        <Field
                         style={{ 
                          width: "20%",
                          height: "20px",
                          border: "0px"
                        }}
                          type="radio"
                          name={`tableData.tableRowValues.${index}.[2]`}
                          value="1"
                        />
                      </span>

                      <span>&nbsp;1 - Good</span>
                    </label>
                
                </Td>

                <Td>
                  <Field
                    as="select"
                    name={`tableData.tableRowValues.${index}.[3]`}
                  >
                    <option value="MC27">MC27</option>
                    <option value="MC9">MC9</option>
                  </Field>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default CustomTable;
