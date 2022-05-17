import React, { useState } from "react";
import DepositPage from "./DepositPage";
import WithdrawPage from "./WithdrawPage";
import Dashboard from "./Dashboard";
import { Col, Row, Layout } from "antd";
import AppMenu from "./AppMenu";
import {
  BrowserRouter as Router, Route, Switch,
} from "react-router-dom";
import Chains from "../Chains";
import Account from "../Account/Account";
import { Logo } from "../../App";
import WalletChain from "./Wallet/WalletChain";
import DashboardContent from "./DashboardContent";

const { Content, Sider, Header } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836"
  },
  header: {
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  bannerX: {
    display: "flex",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};

const Savor = () => {


  const [ walletInstalled, setWalletInstalled ] = useState(false);
  const [ chainId, setChainId] = useState("");
  const [ currentAddress, setCurrentAddress] = useState("");


  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Header style={styles.header}>
        <Logo />
        <div style={styles.headerRight}>
          <WalletChain
            setWalletInstalled={setWalletInstalled}
            setCurrentAddress={setCurrentAddress}
            setChainId={setChainId}
          />

          {/*
            <Chains />
            <Account />
          */}
        </div>
      </Header>
      <Layout>
        <Router>

          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo" />
            <AppMenu />
          </Sider>
          <Layout>
            <Content style={{ margin: '24px 16px 0', }}>
              <Row style={{ margin: "50px auto", display:"flex", justifyContent: "center" }}>
                <Col md={16} sm={24} xs={24}>
                  <Switch>
                    <Route path="/savor">
                      <DepositPage />
                    </Route>
                    <Route path="/withdraw">
                      <WithdrawPage />
                    </Route>
                    <Route path="/dashboard">
                      <DashboardContent />
                    </Route>
                  </Switch>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Router>
      </Layout>
    </div>

  );
};

export default Savor;
