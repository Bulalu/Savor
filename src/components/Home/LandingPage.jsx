import React from "react";
import Banner from "./BannerImage";
import { Col, Row, Button} from "antd";
//import Text from "antd/lib/typography/Text";
import { PlusCircleOutlined } from "@ant-design/icons";
import CountUp from "react-countup";

const LandingPage = () => {

  return (
    <div>
      <Row>
        <Col md={12} sm={24} >
          <h1 style={{ display: "block", paddingTop:"130px", fontSize: "4em", paddingLeft: "1em", fontWeight: 700 }}>Balance your finances with <span style={{ textDecoration: "underline",
            textDecorationColor: "#1890ff" }}>5%</span> APY</h1>
          <Button style={{marginLeft: "3.5em", marginRight: "1em", marginTop: "1em" }}  type="primary" size="large" shape="round">Learn more</Button>
          <Button type="primary" size="large" shape="round" icon={<PlusCircleOutlined />}>Start earning</Button>
        </Col>
        <Col md={12} sm={24}>
          <Banner />
        </Col>
      </Row>
      <Row  style={{ backgroundColor: "#1890ff" }}>
        <Col md={24} sm={24}>
          <h2
            style={{ textTransform:"uppercase", marginTop:"11em", color: "white", fontSize: "1em", display: "flex", justifyContent: "center"}}
          >
            Distributed Yield
          </h2>
          <CountUp
            style={{ padding:"0 1em 3em 1em", color: "white", fontSize: "4em", display: "flex", justifyContent: "center"}}
            start={40020}
            end={11160527.012}
            duration={22.75}
            separator=","
            decimals={0}
            decimal=","
            prefix="$ " />
        </Col>
      </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col md={8} sm={24} style={{margin:"7em 0", display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center"}}  >
            <img width="82px" src="https://zos.alipayobjects.com/rmsportal/WBnVOjtIlGWbzyQivuyq.png" alt="img" />
            <h2>Instant payout</h2>
            <p style={{padding:"0 3em", textAlign:"center"}}>Start earning one minute after you deposit. Follow up with real-time data.</p>
          </Col>
          <Col md={8} sm={24} style={{margin:"7em 0", display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center"}}>
            <img width="82px" src="https://zos.alipayobjects.com/rmsportal/YPMsLQuCEXtuEkmXTTdk.png" alt="img" />
            <h2>Custom dashboard</h2>
            <p style={{padding:"0 3em", textAlign:"center"}}>Your investment data at the point of your fingertips. Anytime. Anywhere.</p>
          </Col>
          <Col md={8} sm={24} style={{margin:"7em 0", display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center"}}>
            <img width="82px" src="https://zos.alipayobjects.com/rmsportal/EkXWVvAaFJKCzhMmQYiX.png" alt="img" />
            <h2>Compound interest</h2>
            <p style={{padding:"0 3em", textAlign:"center"}}>You only win. Your compound interest makes you earn on your earnings.</p>
          </Col>
        </Row>
    </div>
  );
};

export default LandingPage;
