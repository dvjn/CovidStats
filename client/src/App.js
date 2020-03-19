import React from "react";
import { Container, Card, CardBody, CardTitle } from "shards-react";
import TrendsGraph from "./components/TrendsGraph";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

const App = () => {
  return (
    <div className="App">
      <Container>
        <h2>Go Corona, Corona Go!</h2>
        <Card>
          <CardBody>
            <CardTitle>Trends</CardTitle>
            <TrendsGraph />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default App;
