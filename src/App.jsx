import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//import TokenPrice from "components/TokenPrice";
import ERC20Balance from "components/ERC20Balance";
import ERC20Transfers from "components/ERC20Transfers";
import DEX from "components/DEX";
import NFTBalance from "components/NFTBalance";
import Wallet from "components/Wallet";
import { Col, Layout, Row, Tabs } from "antd";
import "antd/dist/antd.css";
//import NativeBalance from "components/NativeBalance";
import "./style.css";
import QuickStart from "components/QuickStart";
import Contract from "components/Contract/Contract";
//import Text from "antd/lib/typography/Text";
import Ramper from "components/Ramper";

import LandingPage from "./components/Home/LandingPage";
import Savor from "./components/Savor/Savor";
import Dashboard from "./components/Savor/Dashboard";

const { Footer } = Layout;

const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <div>
          <Switch>
            <Route exact path="/home">
              <LandingPage isServerInfo={isServerInfo} />
            </Route>
            <Route path="/quickstart">
              <QuickStart />
            </Route>
            <Route path="/wallet">
              <Wallet />
            </Route>
            <Route path="/1inch">
              <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
                <Tabs.TabPane tab={<span>Ethereum</span>} key="1">
                  <DEX chain="eth" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key="2">
                  <DEX chain="bsc" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Polygon</span>} key="3">
                  <DEX chain="polygon" />
                </Tabs.TabPane>
              </Tabs>
            </Route>
            <Route path="/erc20balance">
              <ERC20Balance />
            </Route>
            <Route path="/onramp">
              <Ramper />
            </Route>
            <Route path="/erc20transfers">
              <ERC20Transfers />
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route path="/savor">
              <Savor />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/">
              <Redirect to="/home" />
            </Route>
            <Route path="/ethereum-boilerplate">
              <Redirect to="/quickstart" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#21bf96",
          minHeight: "121px",
        }}
      >
        <footer id="footer" className="dark">
          <div className="footer-wrap">
            <Row>
              <Col md={24} sm={24} xs={24}>
                <div className="footer-center">
                  <p style={{ paddingTop: "25px" }}>Savor 2022</p>
                </div>
              </Col>
            </Row>
          </div>
        </footer>
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <svg
      width="160"
      height="38"
      viewBox="0 -6 50 40"
      fill="#252626"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        id="Layer_2"
        data-name="Layer 2"
        style={{ transform: "scale(0.6, 0.6)" }}
      >
        <g id="Layer_1-2" data-name="Layer 1">
          <g className="cls-1">
            <path
              className="cls-2"
              d="M1.6,39.4A5.84,5.84,0,0,1,0,35.87q0-1.56,2.64-4.14a4.66,4.66,0,0,1,3.25-1.47c1.15,0,2.74,1,4.79,3.07a9.35,9.35,0,0,0,2.45,2,5.81,5.81,0,0,0,2.95,1q5.72,0,5.71-4.66a2.74,2.74,0,0,0-1.57-2.36,11.39,11.39,0,0,0-3.89-1.39,32.05,32.05,0,0,1-5-1.38,32.89,32.89,0,0,1-5-2.24,10.26,10.26,0,0,1-3.9-4.08A13.57,13.57,0,0,1,.8,13.44,12.9,12.9,0,0,1,4.82,4q4-4,11-4a22.5,22.5,0,0,1,6.72,1A13.14,13.14,0,0,1,26.7,2.88l1.53,1.17c1.27,1.19,1.91,2.19,1.91,3a6.8,6.8,0,0,1-1.48,3.37q-2.09,3.08-4.29,3.07a6.38,6.38,0,0,1-3.2-1.22c-.12-.09-.35-.29-.7-.62a11,11,0,0,0-.95-.8,6.19,6.19,0,0,0-3.29-.79,5.47,5.47,0,0,0-3.31.95,3.06,3.06,0,0,0-1.32,2.64,3.16,3.16,0,0,0,1.57,2.73,9.79,9.79,0,0,0,3.89,1.41,44.73,44.73,0,0,1,5.1,1.13,32,32,0,0,1,5.09,1.88,9,9,0,0,1,3.9,3.83,13.36,13.36,0,0,1,1.56,6.72,14.93,14.93,0,0,1-1.59,7,12.22,12.22,0,0,1-4.18,4.7,19.09,19.09,0,0,1-10.61,3.25,20.65,20.65,0,0,1-5.47-.71,14.69,14.69,0,0,1-4.17-1.75,14.87,14.87,0,0,1-4.54-3.8Z"
            />
            <path
              className="cls-2"
              d="M57.69,16.82c.25-2.29,1.86-3.44,4.85-3.44a12.52,12.52,0,0,1,3.56.37A2.55,2.55,0,0,1,67.73,15a5.34,5.34,0,0,1,.55,1.62,18.29,18.29,0,0,1,.09,2.12V40.26a18.29,18.29,0,0,1-.09,2.12A5.93,5.93,0,0,1,67.76,44c-.58,1.06-2,1.59-4.21,1.59s-3.72-.27-4.48-.83a3.36,3.36,0,0,1-1.32-2.42q-2.27,3.26-7.58,3.25t-9.85-4.85a16.16,16.16,0,0,1,0-22.49q4.57-4.82,10-4.82a9.54,9.54,0,0,1,3.8.74,8.41,8.41,0,0,1,2.4,1.38A8.11,8.11,0,0,1,57.69,16.82ZM46.52,29.58a5.1,5.1,0,0,0,1.6,3.66A5.21,5.21,0,0,0,52,34.86a4.87,4.87,0,0,0,3.78-1.66,5.31,5.31,0,0,0,1.5-3.65,5.67,5.67,0,0,0-1.44-3.71A4.78,4.78,0,0,0,52,24.12,5,5,0,0,0,48,25.84,5.54,5.54,0,0,0,46.52,29.58Z"
            />
            <path
              className="cls-2"
              d="M105,14.12c2.13,1.26,3.19,2.62,3.19,4.05a7.51,7.51,0,0,1-1.23,3.37L94.21,43.33a5.62,5.62,0,0,1-2,1.87,5.13,5.13,0,0,1-2.67.83,5.24,5.24,0,0,1-2.52-.64,5,5,0,0,1-1.69-1.32l-.55-.68L72.05,21.54a6.86,6.86,0,0,1-1.22-3.31c0-1.47,1.06-2.85,3.19-4.11a8.11,8.11,0,0,1,3.68-1.35,2.76,2.76,0,0,1,2.12.82,11.91,11.91,0,0,1,1.62,2.49l8,15.47,8-15.47c.45-.78.79-1.34,1-1.69a4.09,4.09,0,0,1,1.07-1,3.3,3.3,0,0,1,2-.52A7.32,7.32,0,0,1,105,14.12Z"
            />
            <path
              className="cls-2"
              d="M113.91,17.43a16.86,16.86,0,0,1,23.51,0,15.87,15.87,0,0,1,5.09,12.12,15.9,15.9,0,0,1-2.64,9.05,16.62,16.62,0,0,1-6.41,5.84,17.54,17.54,0,0,1-7.83,1.87,16.68,16.68,0,0,1-7.85-2,17.4,17.4,0,0,1-6.42-5.89,15.47,15.47,0,0,1-2.61-8.81A15.85,15.85,0,0,1,113.91,17.43ZM121.58,34a6.53,6.53,0,0,0,4,1.5,6.7,6.7,0,0,0,4.05-1.53,5.34,5.34,0,0,0,2-4.54,5.3,5.3,0,0,0-1.91-4.48,6.56,6.56,0,0,0-4.11-1.47A6.44,6.44,0,0,0,121.52,25a5.45,5.45,0,0,0-1.9,4.51A5.28,5.28,0,0,0,121.58,34Z"
            />
            <path
              className="cls-2"
              d="M168.47,13.75A4,4,0,0,1,170.4,15a4.26,4.26,0,0,1,.77,2.85,9.82,9.82,0,0,1-1.16,4.3,3.67,3.67,0,0,1-3.38,2.33,4.77,4.77,0,0,1-2.12-.49,6.09,6.09,0,0,0-2.67-.49,4.88,4.88,0,0,0-3.1,1.16,3.53,3.53,0,0,0-1.44,2.83V40.38a18.17,18.17,0,0,1-.09,2.12,5.11,5.11,0,0,1-.58,1.63c-.62,1.06-2.21,1.59-4.79,1.59a6.77,6.77,0,0,1-4.24-1A3.68,3.68,0,0,1,146.5,42V18.72a18.29,18.29,0,0,1,.09-2.12,5.09,5.09,0,0,1,.52-1.56c.58-1.11,2.17-1.66,4.79-1.66q3.69,0,4.6,1.41a3.55,3.55,0,0,1,.68,2,9.26,9.26,0,0,1,.89-1.05,11.74,11.74,0,0,1,2.48-1.65,7.17,7.17,0,0,1,3.35-1,15,15,0,0,1,2.42.16A13.86,13.86,0,0,1,168.47,13.75Z"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
);

export default App;
