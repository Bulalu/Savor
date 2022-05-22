import React, { useEffect, useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

import { Col, Row, Layout } from "antd";
import AppMenu from "./AppMenu";
import {
  BrowserRouter as Router, Route, Switch,
} from "react-router-dom";
import DashboardContent from "./DashboardContent";


const { Content, Sider} = Layout;



const Dashboard = (props) => {

  const [ depositCount, setDepositCount ] = useState(0);
  const [ withdrawalCount, setWithdrawalCount ] = useState(0);


  useEffect(()=>{
    console.log("NOTICE !!!!! new chainId : "+props.chainId);
  },[props.chainId]);
  useEffect(()=>{
    console.log("NOTICE !!!!! new address : "+props.currentAddress);
  },[props.currentAddress]);

  return (
    <div style={{display: "flex", flexDirection: "column"}}>

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
            <AppMenu
              chainId={props.chainId}
              currentAddress={props.currentAddress}
              depositCount={depositCount}
              withdrawalCount={withdrawalCount}
            />
          </Sider>
          <Layout>
            <Content style={{ margin: '24px 16px 0', }}>
              <Row style={{ margin: "50px auto", display:"flex", justifyContent: "center" }}>
                <Col md={16} sm={24} xs={24}>
                  <Switch>
                    <Route path="/savor">
                      <Deposit />
                    </Route>
                    <Route path="/withdraw">
                      <Withdraw />
                    </Route>
                    <Route path="/dashboard">
                      <DashboardContent
                        chainId={props.chainId}
                        currentAddress={props.currentAddress}
                        setDepositCount={setDepositCount}
                        setWithdrawalCount={setWithdrawalCount}
                      />
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

export default Dashboard;
