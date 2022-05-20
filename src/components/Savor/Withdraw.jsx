import React, { useEffect, useState } from "react";

import { Card, Button, Alert } from "antd";
import VaultAbi from "./ContractABIs/VaultAbi";
import Moralis from "moralis";
import NumberFormat from "react-number-format";
import { useMoralis } from "react-moralis";
import GetUserAllowance from "./Contracts/USDC";



const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
  },
  input: {

    fontWeight: "500",
    fontSize: "23px",
    display: "block",

    width: "100%",
    height: "30px",
    padding: "0 11px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "0",
    borderRadius: "2px",
    outline: "0",
    transition: "all 0.3s linear",
  },
  priceSwap: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
    color: "#434343",
    marginTop: "8px",
    padding: "0 10px",
  },
};




const Withdraw = (props) => {
  console.log("Withdraw : "+JSON.stringify(props));

  const { authenticate, isAuthenticated } = useMoralis();

  /*
    for the Vault
 */
  const [ contractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");
  const [ vaultHoldings, setVaultHoldings ] = useState(0);
  /*
    for the User
 */
  const [ myVaultBalance, setMyVaultBalance ] = useState(0);
  const [ amountToWithdrawal, setAmountToWithdrawal ] = useState("");
  const [ withdrawalStatus, setWithdrawalStatus ] = useState(false);
  const [ warningMessage, setWarningMessage ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ disableSubmitButton, setDisableSubmitButton ] = useState(false);

  //get the vault holdings
  async function getVaultHoldings(){
    //get the vault holdings
    const options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "thisVaultsHoldings",
      abi: VaultAbi(),
    };
    setVaultHoldings(await Moralis.Web3API.native.runContractFunction(options));
    console.log("vault holdings : "+vaultHoldings);

  }



  useEffect(()=>{
    console.log("useEffect chainId and currentAddress : "+props.chainId+" : "+props.currentAddress);
    if (props.currentAddress !== ""){
      getUserDetails();
      getVaultHoldings();
    }
    setAmountToWithdrawal("");
    setWarningMessage("");
    setErrorMessage("");
  }, [props.chainId, props.currentAddress]);

  //get user details
  async function getUserDetails(){
    console.log("getUserDetails : "+props.currentAddress);
    console.log("chainId : "+props.chainId);

    const balance_of_options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "balanceOf",
      abi: VaultAbi(),
      params: {
        '': props.currentAddress
      },
    };
    await Moralis.Web3API.native.runContractFunction(balance_of_options).then(result=>{
      console.log(JSON.stringify(result, null,'\t'));
      console.log("-------------- balance : "+result);
      console.log("My Vault Balance : "+result/1000000);
      setMyVaultBalance(result/1000000);

    }).catch(error=>{
      //vault doesn't exist
      console.log(error);
      console.log(JSON.stringify(error, null,'\t'));
    });

  }

  useEffect(()=>{
    if (parseFloat(amountToWithdrawal) > parseFloat(myVaultBalance)) {
      //show the warning message
      setWarningMessage("Amount exceeds your balance.");
      setDisableSubmitButton(true);
      props.setWithdrawalStatus("Please adjust the amount you want to withdraw.");
    } else {
      setWarningMessage("");
      setDisableSubmitButton(false);
      console.log(parseFloat(amountToWithdrawal));
      props.setWithdrawalStatus("Preparing to make a "+(isNaN(parseInt(amountToWithdrawal))?'':"$"+amountToWithdrawal)+" withdraw.");
    }
  }, [amountToWithdrawal]);


  function updateWithdrawalAmount(event){

    if (isNaN(parseInt(event.target.value))){
      setAmountToWithdrawal("");
    } else {

      setAmountToWithdrawal(event.target.value);

      console.log("comparing : "+parseFloat(event.target.value)+" : "+parseFloat(myVaultBalance));

      //make sure it doesn't exceed the users balance
      if (parseFloat(event.target.value) > parseFloat(myVaultBalance)){
        //show the warning message
        setWarningMessage("Amount exceeds your balance.");
        setDisableSubmitButton(true);

      } else {
        //withdrawal amount ok
        setDisableSubmitButton(false);

        //now compare with vault holdings

        //    setVaultHoldings(200);  //for testing

        console.log("comparing : "+vaultHoldings+" : "+parseInt(event.target.value));

        //compare the vault holdings to the withdrawal amount
        if (vaultHoldings >= parseInt(event.target.value)){
          //everything good
          console.log("all good to proceed");
          setWarningMessage("");
          props.setWithdrawalAmount(event.target.value);
          props.setWithdrawalStatus("Preparing to make a $"+event.target.value+" withdraw.");

        } else {
          //set the split withdrawal notice
          console.log("show the warning message");
          setWarningMessage("Your withdrawal will be separated into two transactions. " +
            "The first (happening now) for $"+(event.target.value-vaultHoldings)+" " +
            "and the second for $"+vaultHoldings+" at the next harvest.");
        }

      }

    }

  }



  async function makeWithdrawal(){
    console.log("makeWithdrawal : "+amountToWithdrawal);



    let withdrawalThisAmount = parseFloat(amountToWithdrawal).toFixed(6);
    console.log("withdrawalThisAmount : "+withdrawalThisAmount);

    if (parseFloat(withdrawalThisAmount) > parseFloat(myVaultBalance)) {
      //problems



    } else {
      //ok to proceed

      if (vaultHoldings >= parseFloat(withdrawalThisAmount)){
        console.log("YAY! enough funds to cover the withdrawal");

        //move to the third step
        props.setCurrent(2);

        if (!isAuthenticated) {

          await authenticate()
            .then(async function (user) {

              //ok to finish transaction
              sendTransaction(withdrawalThisAmount);

            })
            .catch(function (error) {
              console.log(error);
              //disable the button and show spinner
              setDisableSubmitButton(true);
              setWithdrawalStatus(true);

              props.setDepositSuccess(false);
            });

        } else {

          //ok to finish transaction
          sendTransaction(withdrawalThisAmount);

        }


      } else {
        //some level of delayed payout is going to happen
        console.log("!! ALERT - not enough in vault to cover this withdrawal");
        //see if they want to proceed with the withdrawal
        setErrorMessage("")




      }

    }

  }

  async function sendTransaction(withdrawalThisAmount){
    console.log("sendTransaction");

    console.log("submitting amount : "+(withdrawalThisAmount.toString().replace('.', '')));


    //disable the button and show spinner
    setDisableSubmitButton(true);
    setWithdrawalStatus(true);

    //make the withdrawal
    const withdrawalOptions = {
      contractAddress: "0x886b2a3dc127c1122c005669f726d5d37a135411",
      functionName: "withdraw",
      abi: VaultAbi(),
      params: {
        assets: withdrawalThisAmount.toString().replace('.', ''),
        receiver: props.currentAddress,
        owner: props.currentAddress
      },
    };


    try {
      const transaction = await Moralis.executeFunction(withdrawalOptions);

      console.log("the transaction : "+JSON.stringify(transaction, null, '\t'));
      props.setWithdrawalStatus("Transaction posted! Waiting for the confirmation...");

      // Wait until the transaction is confirmed
      await transaction.wait();

      //this will update the user vault balance
      getUserDetails();

      //send the status update
      props.setWithdrawalSuccess(true);
      props.setWithdrawalAmount(amountToWithdrawal);
      props.setWithdrawalTransactionNumber(transaction.hash);
      props.setWithdrawalStatus("");

      //ready to enable the button and turn the spinner off
      setDisableSubmitButton(false);
      setWithdrawalStatus(false);
      setAmountToWithdrawal("");

    } catch (error){
      console.log(JSON.stringify(error, null, '\t'));

      if (error.code === -32603){
        //insufficient funds - you still need gas money
        setErrorMessage("Insufficient funds in this account. Please add funds or choose another account");
      }
      if (error.code === 4001){
        //use canceled transaction

      }

      setDisableSubmitButton(true);
      setWithdrawalStatus(true);

    }

  }




  useEffect(()=>{
    showWarningMessage();
  }, [warningMessage]);

  const showWarningMessage = () => {
    if (warningMessage===""){
      return null;
    } else {
      return (
        <Alert
          message="Notice"
          description={warningMessage}
          type="warning"
          showIcon
          closable
          style={{marginTop:"20px"}}
        />
      )
    }
  }

  useEffect(()=>{
    showErrorMessage();
  }, [errorMessage]);

  const showErrorMessage = () => {
    if (errorMessage===""){
      return null;
    } else {
      return (
        <Alert
          message="Error"
          description={errorMessage}
          type="error"
          showIcon
          closable
          style={{marginTop:"20px"}}
        />
      )
    }
  }




  return(
    <>

      <Card style={styles.card} bodyStyle={{ padding: "18px" }}>
        <Card
          style={{ borderRadius: "1rem" }}
          bodyStyle={{ padding: "0.8rem" }}
        >
          <div style={{ marginBottom: "5px", fontSize: "14px", color: "#434343" }}>
            Withdraw
            <span
              style={{float:"right", cursor:"pointer"}}
              onClick={()=>{
                setAmountToWithdrawal(myVaultBalance);
              }}>
              Full Amount ($
                            <NumberFormat
                              value={myVaultBalance>0?myVaultBalance:0}
                              displayType={'text'}
                              thousandSeparator={true}
                              decimalScale={6}
                              fixedDecimalScale={true} />
              )
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap",
            }}
          >
            <div>
              <input
                placeholder="0"
                style={{ ...styles.input, marginLeft: "-10px" }}
                onChange={updateWithdrawalAmount}
                value={amountToWithdrawal}
                max={myVaultBalance}
              />
            </div>
          </div>
        </Card>

        <Button
          type="primary"
          size="large"
          style={{
            width: "100%",
            marginTop: "15px",
            borderRadius: "0.6rem",
            height: "50px",
          }}
          onClick={() => makeWithdrawal() }
          disabled={disableSubmitButton}
          loading={withdrawalStatus}
        >
          Withdraw
        </Button>

        {showWarningMessage()}
        {showErrorMessage()}

      </Card>
    </>
  );
};

export default Withdraw;
