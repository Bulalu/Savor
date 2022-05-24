import React, { useState } from "react";

import { Col, Row, Layout } from "antd";
import {
  BrowserRouter as Router, Link, Route, Switch,
} from "react-router-dom";
import { Logo } from "../../App";
import WalletChain from "./Wallet/WalletChain";
import NetworkSwitch from "./Wallet/NetworkSwitch";
import Dashboard1 from "./Dashboard1";



const { Content, Header } = Layout;

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
  console.log("In the Savor1");

  const [ walletInstalled, setWalletInstalled ] = useState(false);
  const [ chainId, setChainId] = useState("");
  const [ currentAddress, setCurrentAddress] = useState("");


  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Header style={styles.header}>
        <Link to="/home">
          <Logo />
        </Link>
        <div style={styles.headerRight}>
          <NetworkSwitch
            chainId={chainId}
          />

          <WalletChain
            setWalletInstalled={setWalletInstalled}
            setCurrentAddress={setCurrentAddress}
            setChainId={setChainId}
          />
        </div>
      </Header>
      <Layout>

            <Content style={{ margin: '24px 16px 0', }}>
              <Row style={{ margin: "0 auto", display:"flex", justifyContent: "center" }}>
                <Col md={18} sm={24} xs={24}>
                  <Switch>
                    <Route path="/Savor1/Dashboard">
                      <Dashboard1
                        chainId={chainId}
                        currentAddress={currentAddress}
                      />
                    </Route>
                  </Switch>
                </Col>
              </Row>
            </Content>

      </Layout>
    </div>

  );
};

export default Savor;
