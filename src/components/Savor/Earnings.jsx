import React from "react";
import { Card} from 'antd';

class Earnings extends React.Component {

  render() {
    return (
      <Card bordered="true">
        <p style={{ flex: 1,  }}>5% APY </p>
        <p style={{ flex: 1,  }}>You have staked 212 USDC </p>
      </Card>
    );
  }
}

export default Earnings;
