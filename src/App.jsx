import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
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
import MenuItems from "./components/MenuItems";
import LandingPage from "./components/Home/LandingPage";
import Gimbal from "./components/Gimbal/Gimbal";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "55px",
    padding: "10px",
  },
  header: {
    position: "fixed",
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
        <Header style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
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
            <Route path="/gimbal">
              <Gimbal />
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
                  <p style={{ paddingTop: "25px" }}>Gimbal 2022</p>
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
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <g className="cls-1" transform="scale(0.5 0.5)">
            <path
              className="cls-2"
              d="M24.37,20.32h10.8q3.31.12,4,1.71a7.62,7.62,0,0,1,.61,3.44V39a5.36,5.36,0,0,1-1.72,3.75Q33,48.06,22.65,48.06a21.53,21.53,0,0,1-15.9-6.91A23,23,0,0,1,0,24.49,21.58,21.58,0,0,1,6.87,8.19,22.79,22.79,0,0,1,23.08,1.66,22.55,22.55,0,0,1,36.76,6.44a3.43,3.43,0,0,1,1.66,2.74A6.22,6.22,0,0,1,37,12.64q-2.4,3.25-4.36,3.26c-.78,0-2-.57-3.74-1.69a10.93,10.93,0,0,0-6.14-1.69,12,12,0,0,0-8.29,3.28,11.08,11.08,0,0,0-3.62,8.6,12.32,12.32,0,0,0,3.69,9,11.46,11.46,0,0,0,8.34,3.71A16.06,16.06,0,0,0,29,36V29.34H24.12a5.52,5.52,0,0,1-2.7-.49,2.29,2.29,0,0,1-1-1.45,10.32,10.32,0,0,1-.25-2.57,9.65,9.65,0,0,1,.28-2.61,2,2,0,0,1,1-1.35A6.63,6.63,0,0,1,24.37,20.32Z"
            />
            <path
              className="cls-2"
              d="M54.84,9.11a2.57,2.57,0,0,1-1.63,1.26,10.45,10.45,0,0,1-3.1.37,10.45,10.45,0,0,1-3.1-.37,2.53,2.53,0,0,1-1.62-1.29,5.4,5.4,0,0,1-.56-1.62,18.29,18.29,0,0,1-.09-2.12,18.29,18.29,0,0,1,.09-2.12,5.14,5.14,0,0,1,.53-1.56Q46.22,0,50.14,0t4.67,1.66a5,5,0,0,1,.58,1.62,18.29,18.29,0,0,1,.09,2.12,18.29,18.29,0,0,1-.09,2.12A5,5,0,0,1,54.84,9.11ZM44.74,20.5a18.29,18.29,0,0,1,.09-2.12,6,6,0,0,1,.53-1.63q.86-1.59,4.78-1.59a6.54,6.54,0,0,1,4.18,1,3.42,3.42,0,0,1,1.1,2.64c0,.41.06,1,.06,1.78V42.1a18.29,18.29,0,0,1-.09,2.12,5.11,5.11,0,0,1-.58,1.63q-.8,1.59-4.73,1.59t-4.72-1.65a6.06,6.06,0,0,1-.53-1.6A18.18,18.18,0,0,1,44.74,42Z"
            />
            <path
              className="cls-2"
              d="M71,19.39Q73.83,15,77.88,15a10.05,10.05,0,0,1,9.33,5.34,20,20,0,0,1,1.63-1.94,13.58,13.58,0,0,1,3-2.21A8.58,8.58,0,0,1,96.17,15a10.49,10.49,0,0,1,8.23,3.77q3.31,3.78,3.31,12.49V42a18.29,18.29,0,0,1-.09,2.12,5.11,5.11,0,0,1-.58,1.63c-.54,1.1-2.11,1.65-4.73,1.65s-4.15-.57-4.73-1.72a5.78,5.78,0,0,1-.52-1.62A18.29,18.29,0,0,1,97,42V31.24q0-5.34-3.8-5.34a3,3,0,0,0-2.92,1.41,8.48,8.48,0,0,0-.77,4V42a18.18,18.18,0,0,1-.09,2.15,5.15,5.15,0,0,1-.58,1.6c-.58,1.1-2.17,1.65-4.79,1.65s-4.15-.57-4.73-1.72a5.78,5.78,0,0,1-.52-1.62A18.29,18.29,0,0,1,78.68,42V31.24q0-5.34-3.8-5.34t-3.69,5.34V42.1a18.29,18.29,0,0,1-.09,2.12,4.88,4.88,0,0,1-.58,1.63q-.92,1.59-4.79,1.59T61,45.79a5.71,5.71,0,0,1-.53-1.6A18.18,18.18,0,0,1,60.39,42V20.44a18.29,18.29,0,0,1,.09-2.12,4.39,4.39,0,0,1,.59-1.57Q62,15.1,65.42,15.1c2.3,0,3.79.37,4.49,1.1A4.5,4.5,0,0,1,71,19.39Z"
            />
            <path
              className="cls-2"
              d="M130.36,15.16q5.46,0,10,4.85a16.13,16.13,0,0,1,0,22.49c-3,3.21-6.28,4.82-9.75,4.82s-6-1-7.43-3q-.49,3-5.28,3-3.87,0-4.72-1.66a5.52,5.52,0,0,1-.53-1.62,18.29,18.29,0,0,1-.09-2.12V5.34a18.29,18.29,0,0,1,.09-2.12,4.88,4.88,0,0,1,.53-1.56Q114.1,0,118,0c2.58,0,4.13.55,4.67,1.66a5,5,0,0,1,.58,1.62,18.29,18.29,0,0,1,.09,2.12V18.17A8.51,8.51,0,0,1,130.36,15.16ZM125,35a4.86,4.86,0,0,0,3.77,1.66,5.56,5.56,0,0,0,5.46-5.34,5.51,5.51,0,0,0-1.47-3.71,4.94,4.94,0,0,0-3.93-1.69,4.8,4.8,0,0,0-3.89,1.72,5.61,5.61,0,0,0-1.45,3.71A5.32,5.32,0,0,0,125,35Z"
            />
            <path
              className="cls-2"
              d="M170,18.54c.24-2.3,1.86-3.44,4.84-3.44a12.48,12.48,0,0,1,3.56.37A2.57,2.57,0,0,1,180,16.75a5.21,5.21,0,0,1,.55,1.63,18.29,18.29,0,0,1,.09,2.12V42a18.29,18.29,0,0,1-.09,2.12,5.47,5.47,0,0,1-.52,1.62c-.57,1.07-2,1.6-4.2,1.6s-3.73-.28-4.48-.83A3.29,3.29,0,0,1,170,44.07q-2.28,3.26-7.58,3.25t-9.85-4.85a16.13,16.13,0,0,1,0-22.49q4.56-4.82,10-4.82a9.62,9.62,0,0,1,3.81.74,8.47,8.47,0,0,1,2.39,1.38A8.79,8.79,0,0,1,170,18.54ZM158.77,31.3a5.1,5.1,0,0,0,1.6,3.65,5.19,5.19,0,0,0,3.87,1.63A4.86,4.86,0,0,0,168,34.92a5.32,5.32,0,0,0,1.51-3.65,5.67,5.67,0,0,0-1.45-3.71,4.77,4.77,0,0,0-3.86-1.72,5,5,0,0,0-3.93,1.72A5.57,5.57,0,0,0,158.77,31.3Z"
            />
            <path
              className="cls-2"
              d="M196.4,38.36h16.69a7,7,0,0,1,2.95.46,2.33,2.33,0,0,1,1.22,1.44,8.86,8.86,0,0,1,.31,2.61,8.86,8.86,0,0,1-.31,2.61,2.12,2.12,0,0,1-1,1.35,6.91,6.91,0,0,1-3.19.61h-22.1c-2.86,0-4.54-.77-5-2.33a9.79,9.79,0,0,1-.37-3.13V7.86a18.29,18.29,0,0,1,.09-2.12,5.16,5.16,0,0,1,.59-1.63q.85-1.65,4.79-1.65c2.86,0,4.56.75,5.09,2.27a12.35,12.35,0,0,1,.31,3.19Z"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
);

export default App;
