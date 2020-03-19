import React from "react";
import { Container, Col } from "shards-react";
import TrendsGraph from "./components/TrendsGraph";
import TopCountriesCharts from "./components/TopCountriesCharts";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

const App = () => {
  return (
    <div className="App">
      <Container>
        <h2 className="col-ns">
          Go Corona <span role="img">👋</span>
        </h2>
        <TopCountriesCharts />
        <TrendsGraph />
      </Container>
    </div>
  );
};

export default App;
