import React from "react";
import {  Menu, Button } from "antd";
import { NavLink } from "react-router-dom";
import { PlusCircleOutlined, UpSquareOutlined , DotChartOutlined  } from "@ant-design/icons";



const AppMenu = (props) => {
  return (
        <>
          <Menu
            theme="dark"
            mode="inline"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              width: "100%",
              justifyContent: "left",
              flexDirection: "column",
              paddingTop: "20px"
            }}
          >
            <Menu.Item key="/savor">
              <NavLink to="/savor">
                <Button type="link" size="large" icon={<PlusCircleOutlined />}>
                  Deposit
                  {props.depositCount}
                </Button>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/withdraw">
              <NavLink to="/withdraw">
                <Button type="link" size="large" icon={<UpSquareOutlined />}>
                  Withdraw
                  {props.withdrawalCount}
                </Button>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/dashboard">
              <NavLink to="/dashboard">
                <Button type="link" size="large" icon={<DotChartOutlined  />}>
                  Dashboard
                </Button>
              </NavLink>
            </Menu.Item>
          </Menu>
        </>
  );
};

export default AppMenu;
