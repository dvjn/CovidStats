import React, { useState, useEffect, useCallback } from "react";
import { TableTooltip } from "@nivo/tooltip";
import { ResponsiveLine } from "@nivo/line";
import CollapseLoader from "./CollapseLoader";
import useFormInput from "../hooks/useFormInput";
import {
  InputGroup,
  FormSelect,
  InputGroupText,
  InputGroupAddon,
  Row,
  Col,
  ButtonGroup,
  Button,
  Card,
  CardBody,
} from "shards-react";
import globals from "../globals";

const { formatNumber, search, params, host } = globals;

const parseDataForChart = result =>
  result.index
    .map(([country, state, param], i) => ({
      id: param,
      color: search(param, params).color,
      data: result.columns.map((column, j) => ({
        x: column,
        y: result.data[i][j],
      })),
    }))
    .reverse();

const TrendsGraph = () => {
  const country = useFormInput("All");
  const state = useFormInput("All");
  const [selectedParams, setSelectedParams] = useState(() => {
    let initialParams = {};
    params.forEach(param => (initialParams[param.name] = true));
    return initialParams;
  });
  const [countries, setCountries] = useState(["All"]);
  const [states, setStates] = useState(["All"]);
  const [trendData, setTrendData] = useState([]);

  const handleParamChange = useCallback(param => {
    setSelectedParams(sp => {
      let newSP = {};
      newSP[param] = !sp[param];
      return { ...sp, ...newSP };
    });
  }, []);

  const loadGraph = useCallback(() => {
    fetch(
      host + "/api/get_data/?country=" + country.value + "&state=" + state.value
    )
      .then(res => res.json())
      .then(res => {
        setTrendData(parseDataForChart(res));
      });
  }, [state.value, country.value]);

  useEffect(() => {
    fetch(host + "/api/get_countries")
      .then(res => res.json())
      .then(res => {
        setCountries(res);
      });
    loadGraph();
  }, []);

  useEffect(() => {
    fetch(host + "/api/get_states?country=" + country.value)
      .then(res => res.json())
      .then(res => {
        setStates(res);
      });
  }, [country.value]);

  return (
    <Row>
      <Col>
        <Card>
          <CardBody>
            <h4>
              Trends <span role="img">📈</span>
            </h4>
            <Row>
              <InputGroup size="sm" className="col">
                <InputGroupAddon type="prepend">
                  <InputGroupText>Country</InputGroupText>
                </InputGroupAddon>
                <FormSelect id="country-select" {...country.bind}>
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </FormSelect>
              </InputGroup>
              <InputGroup size="sm" className="col">
                <InputGroupAddon type="prepend">
                  <InputGroupText>State</InputGroupText>
                </InputGroupAddon>
                <FormSelect id="state-select" {...state.bind}>
                  {states.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </FormSelect>
              </InputGroup>
              <div className="col-ns">
                <Button onClick={loadGraph} size="sm">
                  Show Trends
                </Button>
              </div>
            </Row>
            <Row
              className="center-container"
              style={{ padding: "4px", paddingTop: "12px" }}>
              <ButtonGroup size="sm">
                {params.map(param => (
                  <Button
                    key={param.name}
                    onClick={() => handleParamChange(param.name)}
                    theme={selectedParams[param.name] ? "dark" : "light"}>
                    {param.name}
                  </Button>
                ))}
              </ButtonGroup>
            </Row>
            <Row style={{ height: "500px" }}>
              <ResponsiveLine
                data={trendData.filter(d => selectedParams[d.id])}
                margin={{ top: 12, bottom: 48, left: 72, right: 24 }}
                colors={{ datum: "color" }}
                xScale={{
                  type: "time",
                  format: "%m/%d/%y",
                  precision: "day",
                }}
                xFormat="time:%b %d"
                yFormat={formatNumber}
                curve="monotoneX"
                lineWidth={5}
                axisBottom={{
                  format: "%b %d",
                }}
                sliceTooltip={({ slice }) => (
                  <TableTooltip
                    title={slice.points[0].data.xFormatted}
                    rows={slice.points.map(point => [
                      <span
                        style={{
                          display: "block",
                          width: "12px",
                          height: "12px",
                          borderRadius: "12px",
                          background: point.serieColor,
                        }}
                      />,
                      point.serieId,
                      <strong key="value">{point.data["yFormatted"]}</strong>,
                    ])}
                  />
                )}
                enableGridX={false}
                enableGridY={true}
                enableSlices="x"
                enablePoints={false}
                useMesh={true}
                enableArea={true}
                legends={[
                  {
                    anchor: "top-left",
                    direction: "column",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolShape: "circle",
                    padding: 20,
                    itemBackground: "#ffffff",
                    onClick: p => handleParamChange(p.label),
                  },
                ]}
              />
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default TrendsGraph;
