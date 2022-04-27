import React from "react";
import { Card, Statistic, Row, Col} from 'antd';
import CountUp from "react-countup";


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
            <div className="ant-statistic-title">You started to win <span style={{fontWeight: "bold"}}>5%</span> APY</div>
            <CountUp
              style={{color: "black", fontSize: "3em"}}
              start={1161.012}
              end={1171.012}
              duration={1122.75}
              separator=","
              decimals={3}
              decimal="."
              prefix="$ " />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Earnings;
