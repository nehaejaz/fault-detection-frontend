import ShowData from "./ShowData";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Collapse } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";

function CustomTab({ tabNames, header, data }) {
  console.log("item", data);

  const [openComp, setOpenComp] = useState();
  const [open, setOpen] = useState(false);
  const [openSamples, setOpenSamples] = useState(false);
  const collapseHandler = (component) => {
    // if (component == "master"){

    // }
    setOpenComp(component);
  };

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3} md={3} lg={2}>
          <Nav variant="pills" className="flex-column root ">
            <h4 className="text-secondary" style={{ marginLeft: "10%" }}>
              CSV Files
            </h4>
            {data.map((item, i) => {
              return (
                <>
                  <Button
                    onClick={() => collapseHandler(item.component)}
                    variant="secondary"
                    className="m-2"
                    aria-controls={item.component}
                    aria-expanded={item.component == openComp ? true : false}
                  >
                    {item.component}
                  </Button>
                  <Collapse in={item.component == openComp ? true : false}>
                    <div id={item.component} className="text-danger">
                      {item.component == "master" ? (
                        <>
                          <Nav.Item>
                            <Nav.Link
                              key={i}
                              eventKey={`all-${item.component}`}
                              className="m-2"
                            >
                              All
                            </Nav.Link>
                          </Nav.Item>
                        </>
                      ) : (
                        <>
                          <Nav.Item>
                            <Nav.Link
                              key={i}
                              eventKey={`all-${item.component}`}
                              className="m-2"
                            >
                              All
                            </Nav.Link>
                            <Nav.Link
                              key={i}
                              eventKey={`training-${item.component}`}
                              onClick={() => setOpen(!open)}
                              className="m-2"
                            >
                              Training
                            </Nav.Link>
                            <Collapse in={open}>
                              <div
                                id="example-collapse-text"
                                className="text-danger"
                              >
                                {item.child.map((y) => {
                                  return y.train.map((z) => {
                                    return (
                                      <Nav.Item style={{ paddingLeft: "10%" }}>
                                        <Nav.Link
                                          style={{ color: "black" }}
                                          key={i}
                                          eventKey={`${z.fileName}`}
                                        >
                                          {z.fileName}
                                        </Nav.Link>
                                      </Nav.Item>
                                    );
                                  });
                                })}
                              </div>
                            </Collapse>
                            <Nav.Link
                              key={i}
                              eventKey={"sample"}
                              className="m-2"
                              onClick={() => setOpenSamples(!openSamples)}
                            >
                              sample
                            </Nav.Link>
                            <Collapse in={openSamples}>
                              <div id="samples" className="text-danger">
                                {item.child.map((y) => {
                                  return y.samples.map((z) => {
                                    return z.map((s) => {
                                      return (
                                        <Nav.Item
                                          style={{ paddingLeft: "10%" }}
                                        >
                                          <Nav.Link
                                            style={{ color: "black" }}
                                            key={i}
                                            eventKey={`${s.fileName}`}
                                          >
                                            {s.fileName}
                                          </Nav.Link>
                                        </Nav.Item>
                                      );
                                    });
                                  });
                                })}
                              </div>
                            </Collapse>
                          </Nav.Item>
                        </>
                      )}
                    </div>
                  </Collapse>
                </>
              );
            })}
          </Nav>
        </Col>
        <Col sm={9} md={9} lg={10}>
          <Tab.Content>
            {data.map((item, i) => {
              return (
                <>
                  {/* Tab Pane for all data csv */}
                  <Tab.Pane key={i} eventKey={`all-${item.component}`}>
                    {item.child.map((array, i) => {
                      return (
                        <ShowData
                          key={i}
                          header={header}
                          data={array.all[0].rowData}
                          fileName={array.all[0].fileName}
                        />
                      );
                    })}
                  </Tab.Pane>

                  {/* Tab Pane for Training sets */}
                  {item.child.map((x) => {
                    if (item.component !== "master") {
                      return x.train.map((y, i) => {
                        return (
                          <Tab.Pane key={i} eventKey={y.fileName}>
                            <ShowData
                              key={i}
                              header={header}
                              data={y.rowData}
                              fileName={y.fileName}
                            />
                          </Tab.Pane>
                        );
                      });
                    }
                  })}

                  {/* Tab Pane for Sample */}
                  {item.child.map((x) => {
                    if (item.component !== "master") {
                      return x.samples.map((y) => {
                        return y.map((s,i) => {
                          return (
                            <Tab.Pane key={i} eventKey={s.fileName}>
                              <ShowData
                                key={i}
                                header={header}
                                data={s.rowData}
                                fileName={s.fileName}
                              />
                            </Tab.Pane>
                          );
                        });
                      });
                    }
                  })}
                </>
              );
            })}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default CustomTab;
