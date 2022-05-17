import React from "react";
import { Card, Statistic, Row, Col, Button } from "antd";
import { NavLink } from "react-router-dom";


const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60; // Moment is also OK


class Earnings extends React.Component {
  render() {
    return (
      <Card bordered="true">
        <Row gutter={16}>
          <Col span={12}>
            <Countdown title="Next payout in" value={deadline} />
          </Col>
        </Row>
        <Row gutter={16} style={{marginTop: "20px"}}>
          <Col span={24}>
            <NavLink to="/dashboard">
              <Button type="primary" size="large" >
                Go to dashboard
              </Button>
            </NavLink>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Earnings;
