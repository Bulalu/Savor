import React from "react";
import { Steps } from "antd";
import Account from "../Account/Account"
import Deposit from "./Deposit"
import Earnings from "./Earnings"


const { Step } = Steps;

class DepositPage extends React.Component {
  state = {
    current: 0,
  };

  onChange = current => {
    console.log('onChange:', current);
    this.setState({ current });
  };

  render() {
    const { current } = this.state;

    return (
      <>
        <Steps current={current} onChange={this.onChange} direction="vertical">
          <Step title="Connect" description={<Account/>}/>
          <Step title="Deposit" description={<Deposit/>} />
          <Step title="Earn" description={<Earnings/>} />
        </Steps>
      </>
    );
  }
}

export default DepositPage;
