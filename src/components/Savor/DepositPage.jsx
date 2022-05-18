import React from "react";
import { Alert, Col, Steps } from "antd";
import Account from "../Account/Account"
import Deposit from "./Deposit"
import Earnings from "./Earnings"
import WalletChain from "./Wallet/WalletChain";


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
        <Alert
          message="USDC"
          description="Deposit only USDC on the Ethereum or Polygon blockchains."
          type="success"
          showIcon
          closable
          style={{marginBottom:"10px"}}
        />
        <Alert
          message="Warning"
          description="This is experimental software. You can lose part or all of your funds. Please proceed with caution. "
          type="warning"
          showIcon
          closable
          style={{marginBottom:"40px"}}
        />
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
