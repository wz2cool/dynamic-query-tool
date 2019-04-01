import * as React from "react";
import { hot } from "react-hot-loader/root";
import { AppRouter } from "./component/AppRouter";
import { Header } from "./component/Header";
import { Footer } from "./component/Footer";
import { NavBar } from "./component/NavBar";
import "./App.css";

declare var NODE_ENV: string;

const isDev = NODE_ENV === "development";
console.log("isDev: ", isDev);
const App = () => (
  <div className="root">
    <Header />
    <div>
      <NavBar />
      <AppRouter />
    </div>
    <Footer />
  </div>
);

export default (isDev ? hot(App) : App);
