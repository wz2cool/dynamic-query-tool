import * as React from "react";
import { Route, HashRouter } from "react-router-dom";
import Home from "../route/dashboard/Home";
import { Layout, Breadcrumb } from "antd";
import { NavBar } from "./NavBar";

const About = React.lazy(() => import("../route/dashboard/About"));
const Readme = React.lazy(() => import("../route/dashboard/Readme"));

export class AppRouter extends React.PureComponent {
  public render() {
    return (
      <HashRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <NavBar />
          <Layout>
            <Layout.Header style={{ background: "#fff", padding: 0 }} />
            <Layout.Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb>
              <React.Suspense fallback={<div>Loading...</div>}>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/readme" component={Readme} />
              </React.Suspense>
            </Layout.Content>
            <Layout.Footer style={{ textAlign: "center" }}>
              Ant Design ©2018 Created by Ant UED
            </Layout.Footer>
          </Layout>
        </Layout>
      </HashRouter>
    );
  }
}
