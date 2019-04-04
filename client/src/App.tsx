import * as React from "react";
import { hot } from "react-hot-loader/root";
import { AppRouter } from "./component/AppRouter";

import "./App.css";

const App = () => <AppRouter />;

declare var NODE_ENV: string;
const isDev = NODE_ENV === "development";
console.log("isDev: ", isDev);
export default (isDev ? hot(App) : App);
