import React, { useEffect, useState } from "react";
import { Alert, Steps } from "antd";

import WalletChain from "./Wallet/WalletChain";
import Deposit from "./Deposit"
import Earnings from "./Earnings"


const { Step } = Steps;

function DepositPage(props){
  console.log("DepositPage : "+JSON.stringify(props));

  const [ current, setCurrent] = useState(0);

  const [ walletInstalled, setWalletInstalled ] = useState(false);
  const [ chainId, setChainId] = useState("");
  const [ currentAddress, setCurrentAddress] = useState("");
  const [ canMakeDeposit, setCanMakeDeposit ] = useState(true);

  const [ depositSuccess, setDepositSuccess] = useState(null);
  const [ depositAmount, setDepositAmount] = useState(0);
  const [ depositTransactionNumber, setDepositTransactionNumber] = useState(0);

  const [ showMainnetWarning, setShowMainnetWarning ] = useState(true);

  useEffect(()=>{
    console.log("depositSuccess was just updated! : "+depositSuccess);
    if (depositSuccess) {setCurrent(2);}
  }, [depositSuccess]);

  useEffect(()=>{
    if (currentAddress !== ""){
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  }, [currentAddress]);

  useEffect(()=>{
    if (current === 0 || current === 1){
      setDepositSuccess(null);
    }
  }, [current]);


  useEffect(()=>{
    console.log("useEffect chainId and currentAddress : "+props.chainId+" : "+props.currentAddress);
    const validChainIds = ["0x4","0x13881","0xa86a","0x89"];
    setCanMakeDeposit(validChainIds.includes(props.chainId));

    if (props.chainId === "0x4" || props.chainId === "0x13881"){
      //testnet
      setShowMainnetWarning(false);
    } else {
      //mainnet
      setShowMainnetWarning(true);
    }

  }, [props.chainId, props.currentAddress]);

  const shouldShowMainnetWarnings = () => {
    if (showMainnetWarning){
      return (
        <>
          <Alert
            message="USDC"
            description="Deposit only USDC on the Avalanche or Polygon blockchains."
            type="success"
            showIcon
            closable
            style={{marginBottom:"10px", fontSize:"11px"}}
          />
          <Alert
            message="Warning"
            description="This is experimental software. You can lose part or all of your funds. Please proceed with caution. "
            type="warning"
            showIcon
            closable
            style={{marginBottom:"40px", fontSize:"11px"}}
          />
        </>
      );
    } else {
      return <></>;
    }
  }


  console.log("Can Make Deposit : "+canMakeDeposit);
  if (canMakeDeposit){

    return (
      <>

        <Steps current={current} onChange={setCurrent} direction="vertical">
          <Step
            title={props.currentAddress === "" ? "Connect" : "Connected"}
            description={
              <WalletChain
                setWalletInstalled={setWalletInstalled}
                setCurrentAddress={setCurrentAddress}
                setChainId={setChainId}
              />
            }
          />
          <Step
            title="Deposit"
            description={
              <Deposit
                chainId={props.chainId}
                currentAddress={props.currentAddress}
                myUSDCBalance={props.myUSDCBalance}
                setDepositSuccess={setDepositSuccess}
                setDepositAmount={setDepositAmount}
                setDepositTransactionNumber={setDepositTransactionNumber}
              />
            }
          />
          <Step
            title="Earn"
            description={
              <Earnings
                depositSuccess={depositSuccess}
                depositAmount={depositAmount}
                depositTransactionNumber={depositTransactionNumber}
                setCurrent={setCurrent}
              />
            }
          />
        </Steps>
      </>
    );

  } else {
    //no vault to deposit to
    return(
      <Alert
        message="NOTICE"
        description="Savor Vault does not exist on this network."
        type="error"
        showIcon
        closable
        style={{marginBottom:"40px", fontSize:"11px"}}
      />
    )

  }

}

export default DepositPage;
