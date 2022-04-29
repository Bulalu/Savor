import React from "react";
import { Steps } from "antd";
import Account from "../Account/Account"
import Unstake from "./Withdraw/DEX"


const { Step } = Steps;

class Deposit extends React.Component {
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
          <Step title="Withdraw" description={<Unstake/>} />
        </Steps>
      </>
    );
  }
}

export default Deposit;
