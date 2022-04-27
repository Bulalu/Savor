import React from "react";
import Stepper from "./Stepper"
import { Col, Row } from "antd";

const Gimbal = () => {
  return (
    <Row style={{ margin: "50px auto"  }}>
      <Col md={24} sm={24} xs={24}>
        <Stepper />
      </Col>
    </Row>
  );
};

export default Gimbal;
