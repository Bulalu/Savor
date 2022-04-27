import React from "react";
import { Steps } from "antd";
import Account from "../Account/Account"
import Stake from "./Stake"

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
          <Step title="Stake" description={<Stake/>} />
          <Step title="Earning" description="This is a description." />
        </Steps>
      </>
    );
  }
}

export default Stepper;
