import React, { useState, useEffect } from "react";
import { FormSelect } from "shards-react";
import useFormInput from "./hooks/useFormInput";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

const App = () => {
  const country = useFormInput("All");
  const state = useFormInput("All");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetch("https://covid19-stats.herokuapp.com/api/get_countries")
      .then(res => res.json())
      .then(res => {
        setCountries(res);
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://covid19-stats.herokuapp.com/api/get_states?country=" +
        country.value
    )
      .then(res => res.json())
      .then(res => {
        setStates(res);
      });
  }, [country.value]);

  return (
    <div className="App">
      <FormSelect {...country.bind}>
        {countries.map(country => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </FormSelect>
      <FormSelect {...state.bind}>
        {states.map(state => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </FormSelect>
    </div>
  );
};

export default App;
