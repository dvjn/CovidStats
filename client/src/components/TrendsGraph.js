import React, { useState, useEffect, useCallback } from "react";
import { TableTooltip } from "@nivo/tooltip";
import { ResponsiveLine } from "@nivo/line";
import useFormInput from "../hooks/useFormInput";
import {
  InputGroup,
  FormSelect,
  InputGroupText,
  InputGroupAddon,
  Row,
  ButtonGroup,
  Button,
} from "shards-react";
import globals from "../globals";

const { search, params, host } = globals;

const parseDataForChart = result =>
  result.data.index.map((param, i) => ({
    id: param,
    color: search(param, params).color,
    data: result.data.columns.map((column, j) => ({
      x: column,
      y: result.data.data[i][j],
    })),
  }));

const TrendsGraph = () => {
  const country = useFormInput("All");
  const state = useFormInput("All");
  const [selectedParams, setSelectedParams] = useState(() => {
    let initialParams = {};
    params.map(param => (initialParams[param.name] = true));
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

  useEffect(() => {
    fetch(host + "/api/get_countries")
      .then(res => res.json())
      .then(res => {
        setCountries(res);
      });
  }, []);

  useEffect(() => {
    fetch(host + "/api/get_states?country=" + country.value)
      .then(res => res.json())
      .then(res => {
        setStates(res);
      });
  }, [country.value]);

  useEffect(() => {
    fetch(
      host +
        "/api/get_time_series?format=split&country=" +
        country.value +
        "&state=" +
        state.value
    )
      .then(res => res.json())
      .then(res => {
        setTrendData(parseDataForChart(res));
      });
  }, [country.value, state.value]);

  return (
    <>
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
        <ButtonGroup size="sm" className="col">
          {params.map(param => (
            <Button
              key={param.name}
              onClick={() => handleParamChange(param.name)}
              theme={selectedParams[param.name] ? "primary" : "light"}>
              {param.name}
            </Button>
          ))}
        </ButtonGroup>
      </Row>
      <Row style={{ height: "500px" }}>
        <ResponsiveLine
          data={trendData.filter(d => selectedParams[d.id])}
          margin={{ top: 50, bottom: 50, left: 75, right: 50 }}
          colors={{ datum: "color" }}
          xScale={{
            type: "time",
            format: "%m/%d/%y",
            precision: "day",
          }}
          xFormat="time:%b %d"
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
            },
          ]}
        />
      </Row>
    </>
  );
};

export default TrendsGraph;
