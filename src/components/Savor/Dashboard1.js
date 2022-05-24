import React, { useEffect, useState } from "react";

import { Col, Row, Layout } from "antd";
import DashboardContents1 from "./DashboardContents1";

const { Content} = Layout;



const Dashboard = (props) => {
  console.log("Dashboard : "+JSON.stringify(props));


  useEffect(()=>{
    console.log("NOTICE !!!!! new chainId : "+props.chainId);
  },[props.chainId]);
  useEffect(()=>{
    console.log("NOTICE !!!!! new address : "+props.currentAddress);
  },[props.currentAddress]);

  return (
    <div style={{display: "flex", flexDirection: "column"}}>

      <DashboardContents1
        chainId={props.chainId}
        currentAddress={props.currentAddress}
      />

    </div>

  );
};

export default Dashboard;
