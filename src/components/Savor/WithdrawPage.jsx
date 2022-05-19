import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import Withdraw from "./Withdraw"
import WalletChain from "./Wallet/WalletChain";
import Earnings from "./Earnings";
import WithdrawalStatus from "./WithdrawalStatus";


const { Step } = Steps;

function WithdrawPage(props){

  const [ current, setCurrent] = useState(0);

  const [ walletInstalled, setWalletInstalled ] = useState(false);
  const [ chainId, setChainId] = useState("");
  const [ currentAddress, setCurrentAddress] = useState("");

  const [ withdrawalSuccess, setWithdrawalSuccess] = useState(null);
  const [ withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [ withdrawalTransactionNumber, setWithdrawalTransactionNumber] = useState(0);
  const [ withdrawalStatus, setWithdrawalStatus ] = useState("");

  useEffect(()=>{
    console.log("depositSuccess was just updated! : "+withdrawalSuccess);
    if (withdrawalSuccess) {setCurrent(2);}
  }, [withdrawalSuccess]);

  useEffect(()=>{
    if (currentAddress !== ""){
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  }, [currentAddress]);

  useEffect(()=>{
    if (current === 0 || current === 1){
      setWithdrawalAmount("");
      setWithdrawalSuccess(null);
    }
  }, [current]);

    return (
      <>
        <Steps current={current} onChange={setCurrent} direction="vertical">
          <Step
            title="Connect"
            description={
              <WalletChain
                setWalletInstalled={setWalletInstalled}
                setCurrentAddress={setCurrentAddress}
                setChainId={setChainId}
              />
            }
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

}

export default WithdrawPage;
