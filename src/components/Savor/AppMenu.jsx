import React from "react";
import {  Menu, Button } from "antd";
import { NavLink } from "react-router-dom";
import { PlusCircleOutlined, UpSquareOutlined , DotChartOutlined  } from "@ant-design/icons";


const AppMenu = () => {
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
            <Menu.Item key="/deposit">
              <NavLink to="/Savor1/Deposit">
                <Button type="link" size="large" icon={<PlusCircleOutlined />}>
                  Deposit
                </Button>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/withdraw">
              <NavLink to="/Savor1/Withdraw">
                <Button type="link" size="large" icon={<UpSquareOutlined />}>
                  Withdraw
                </Button>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/dashboard">
              <NavLink to="/Savor1/Dashboard">
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
