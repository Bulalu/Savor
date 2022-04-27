import React from "react";
import { Steps } from "antd";
import Account from "../Account/Account"
import Dex from "../DEX/DEX"
import Earnings from "./Earnings"


const { Step } = Steps;

class Stepper extends React.Component {
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
          <Step title="Stake" description={<Dex/>} />
          <Step title="Earnings" description={<Earnings/>} />
        </Steps>
      </>
    );
  }
}

export default Stepper;
