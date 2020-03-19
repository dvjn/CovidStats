import React, { useState, useEffect, useCallback } from "react";
import { Collapse } from "shards-react";
import ActivityIndicator from "./ActivityIndicator";

const CollapseLoader = ({ loaded, children }) => (
  <>
    <Collapse open={!loaded}>
      <ActivityIndicator />
    </Collapse>
    <Collapse open={loaded}>{children}</Collapse>
  </>
);

export default CollapseLoader;
