import React from "react";
import { Col, Row} from "antd";


const Dashboard = () => {
  return (
        <Row style={{ margin: "50px auto", display:"flex", justifyContent: "center" }}>
          <Col md={12} sm={24} xs={24}>
            <h3>Welcome to the dashboard</h3>
          </Col>
        </Row>
  );
};

export default Dashboard;
