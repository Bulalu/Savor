import React from "react";
import { Card, Statistic, Row, Col, Button, Result } from "antd";
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
            <Result
              status="success"
              title="Successfully Deposited Into the Savor Vault!"
              subTitle="Transaction id: 0xf7cd8188995.......f32a4008480fe872"
              extra={[
                <>
                  <NavLink to="/dashboard">
                    <Button type="primary" size="large" >
                      Go to dashboard
                    </Button>
                  </NavLink>
                  <Button style={{marginLeft: "10px"}}  size="large" >
                  Make new deposit
                  </Button>
                </>
              ]}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{marginTop: "20px"}}>
          <Col span={24}>
            <Result
              status="error"
              title="Deposit Failed"
              subTitle="Make sure you are depositing USDC and have enough gas."
              extra={
                <>
                  <Button size="large" >
                    Try depositing again
                  </Button>
                </>
              }
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Earnings;
