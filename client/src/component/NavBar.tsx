import * as React from "react";
import { Link } from "react-router-dom";

import { Layout, Menu, Icon } from "antd";

const { SubMenu } = Menu;
const { Sider } = Layout;

interface INavBarProps {}

interface INavBarState {
  collapsed: boolean;
}

export class NavBar extends React.PureComponent<INavBarProps, INavBarState> {
  constructor(props: INavBarProps) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  private onCollapse = (collapsed: boolean): void => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  public render() {
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
      >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>Option 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Option 2</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">
              <Link to="/about">about</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/readme">readme</Link>
            </Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
