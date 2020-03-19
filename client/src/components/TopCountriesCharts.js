import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  ButtonGroup,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormSelect,
} from "shards-react";
import CollapseLoader from "./CollapseLoader";
import globals from "../globals";

const { formatNumber, params, host } = globals;

const changeSpans = [
  ["dayChange", "Yesterday"],
  ["weekChange", "Last Week"],
  ["monthChange", "Last Month"],
];

const TopCountriesCharts = () => {
  const [topCountriesData, setTopCountriesData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [changeSpan, setChangeSpan] = useState(() => {
    let initial = {};
    params.forEach(({ name }) => {
      initial[name] = "dayChange";
    });
    return initial;
  });

  useEffect(() => {
    fetch(host + "/api/get_top_countries")
      .then(res => res.json())
      .then(res => {
        setTopCountriesData(res);
        setTimeout(() => setDataLoaded(true), 100);
      });
  }, []);

  const handleSpanSelect = useCallback((param, value) => {
    setChangeSpan(cs => {
      let newCS = {};
      newCS[param] = value;
      return { ...cs, ...newCS };
    });
  });

  return (
    <Row>
      {params.map(({ name, longname, color }) => (
        <Col>
          <Card>
            <CardBody>
              <h4>{longname}</h4>
              <CollapseLoader loaded={dataLoaded}>
                {topCountriesData && (
                  <>
                    <h1 style={{ textAlign: "right" }}>
                      <span
                        style={{
                          color,
                          fontSize: "0.5em",
                          marginRight: "8px",
                        }}>
                        +
                        {formatNumber(
                          topCountriesData[name]["All"][changeSpan[name]]
                        )}
                      </span>
                      {formatNumber(topCountriesData[name]["All"].current)}
                    </h1>
                    <table>
                      {Object.keys(topCountriesData[name]).map(country => {
                        if (country == "All") return;
                        const datum = topCountriesData[name][country];
                        return (
                          <tr className="row-ns">
                            <td style={{ width: "100%" }}>{country}</td>
                            <td
                              style={{
                                paddingLeft: "12px",
                                textAlign: "right",
                              }}>
                              <strong>{formatNumber(datum.current)}</strong>
                            </td>
                            <td
                              style={{
                                color,
                                fontSize: "0.8em",
                                paddingLeft: "12px",
                                textAlign: "right",
                              }}>
                              <strong>
                                +{formatNumber(datum[changeSpan[name]])}
                              </strong>
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                    {/*<div
                      style={{
                        paddingTop: "12px",
                      }}
                      className="center-container">
                       <ButtonGroup size="sm">
                        {changeSpans.map(([key, value]) => (
                          <Button
                            key={key}
                            onClick={() => handleSpanSelect(name, key)}
                            theme={changeSpan[name] == key ? "dark" : "light"}>
                            {value}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </div> */}
                    <InputGroup size="sm" style={{ paddingTop: "12px" }}>
                      <InputGroupAddon type="prepend">
                        <InputGroupText>Since</InputGroupText>
                      </InputGroupAddon>
                      <FormSelect
                        value={changeSpan[name]}
                        onChange={e => handleSpanSelect(name, e.target.value)}>
                        {changeSpans.map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </FormSelect>
                    </InputGroup>
                  </>
                )}
              </CollapseLoader>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TopCountriesCharts;
