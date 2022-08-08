import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ShowData from "./ShowData";

const CustomTab = ({ tabNames, header, data }) => {
  console.log("data=>", data);
  return (
    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >

      {data.map((item, i) => {
       
        return (
          <Tab key={i} eventKey={item.fileName} title={item.fileName}>
            {item.rowData.map((array,i) => {
              return <ShowData key={i} header={header} data={array} fileName={item.fileName} />;
            })}
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default CustomTab;
