import * as React from "react";
import { Route, HashRouter, Link } from "react-router-dom";
import Home from "../module/dashboard/Home";

const About = React.lazy(() => import("../module/dashboard/About"));
const Readme = React.lazy(() => import("../module/dashboard/Readme"));

export class AppRouter extends React.PureComponent {
  public render() {
    return (
      <HashRouter>
        <Link to="/">Home</Link>
        <Link to="/about">about</Link>
        <Link to="/readme">readme</Link>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/readme" component={Readme} />
        </React.Suspense>
      </HashRouter>
    );
  }
}
