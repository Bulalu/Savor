import React, { useEffect, useState } from "react";
import { Alert, Steps } from "antd";
import Withdraw from "./Withdraw"
import WithdrawalStatus from "./WithdrawalStatus";
import { getEllipsisTxt } from "../../helpers/formatters";
import WalletChain from "./Wallet/WalletChain";


const { Step } = Steps;

function WithdrawPage(props){
  console.log("WithdrawPage : "+JSON.stringify(props));

  const [ current, setCurrent] = useState(0);
  const [ walletInstalled, setWalletInstalled ] = useState(false);
  const [ chainId, setChainId] = useState("");
  const [ currentAddress, setCurrentAddress] = useState("");

  const [ canMakeWithdrawal, setCanMakeWithdrawal ] = useState(true);

  const [ withdrawalSuccess, setWithdrawalSuccess] = useState(null);
  const [ withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [ withdrawalTransactionNumber, setWithdrawalTransactionNumber] = useState(0);
  const [ withdrawalStatus, setWithdrawalStatus ] = useState("");

  useEffect(()=>{
    console.log("depositSuccess was just updated! : "+withdrawalSuccess);
    if (withdrawalSuccess) {setCurrent(2);}
  }, [withdrawalSuccess]);

  useEffect(()=>{
    if (props.currentAddress !== ""){
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  }, [props.currentAddress]);

  useEffect(()=>{
    if (current === 0 || current === 1){
      setWithdrawalAmount("");
      setWithdrawalSuccess(null);
    }
  }, [current]);

  useEffect(()=>{
    console.log("useEffect chainId and currentAddress : "+props.chainId+" : "+props.currentAddress);
    const validChainIds = ["0x4","0x13881","0xa86a","0x89"];
    setCanMakeWithdrawal(validChainIds.includes(props.chainId));
  }, [props.chainId, props.currentAddress]);


  if (canMakeWithdrawal){

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
              />            }
          />
          <Step
            title="Withdraw"
            description={
              <Withdraw
                chainId={props.chainId}
                currentAddress={props.currentAddress}
                setWithdrawalSuccess={setWithdrawalSuccess}
                setWithdrawalAmount={setWithdrawalAmount}
                setWithdrawalTransactionNumber={setWithdrawalTransactionNumber}
                setCurrent={setCurrent}
                setWithdrawalStatus={setWithdrawalStatus}
              />
            }
          />
          <Step
            title="Status"
            description={
              <WithdrawalStatus
                withdrawalSuccess={withdrawalSuccess}
                withdrawalAmount={withdrawalAmount}
                withdrawalTransactionNumber={withdrawalTransactionNumber}
                setCurrent={setCurrent}
                withdrawalStatus={withdrawalStatus}
              />
            }
          />
        </Steps>
      </>
    );

  } else {
    //no vault to withdraw from
    return(
      <Alert
        message="NOTICE"
        description="Please switch to Avalanche or Polygon networks to make a withdrawal."
        type="error"
        showIcon
        closable
        style={{marginBottom:"40px"}}
      />
    )
  }

}

export default WithdrawPage;
