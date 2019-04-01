import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

const render = () => {
  const MOUNT_NODE = document.getElementById("root");
  ReactDOM.render(<App />, MOUNT_NODE);
};

render();
