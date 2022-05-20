import React, {useEffect, useState} from "react";
import Web3 from "web3";
import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api, useWeb3Transfer } from "react-moralis";
import Moralis from "moralis";

import { Col, Row, Layout, Card, Table, InputNumber, Button, Alert } from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";
import Vault, { VaultEvents } from "./Contracts/Vault";
import GetUserAllowance, { SetUserAllowance } from "./Contracts/USDC";
import USDCAbi from "./ContractABIs/USDCAbi";

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

function Deposit(props) {
  console.log("Deposit : "+JSON.stringify(props));

  const Web3Api = useMoralisWeb3Api();
  const { authenticate, isAuthenticated } = useMoralis();

  /*
      for the Vault
   */
  const [ contractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");

  /*
      for the User
   */
  const [ myVaultBalance, setMyVaultBalance ] = useState(0);
  const [ myAllowance, setMyAllowance ] = useState(0);
  const [ depositAmount, setDepositAmount ] = useState([]);
  const [ depositStatus, setDepositStatus ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");

  console.log("------------------------ : "+props.chainId+" : "+props.currentAddress);

  useEffect(()=>{
    console.log("useEffect chainId and currentAddress : "+props.chainId+" : "+props.currentAddress);
    if (props.currentAddress !== ""){
      getUserDetails();
    }
  }, [props.currentAddress]);


  //get user details
  async function getUserDetails() {
    console.log("getUserDetails : " + props.currentAddress);
    console.log("chainId : " + props.chainId);

    const balance_of_options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "balanceOf",
      abi: VaultAbi(),
      params: {
        '': props.currentAddress
      },
    };
    const balance_of = await Moralis.Web3API.native.runContractFunction(balance_of_options);
    console.log("-------------- balance : "+balance_of);
    console.log("My Vault Balance : "+balance_of/1000000);
    setMyVaultBalance(balance_of/1000000);

    console.log("Get the Allowance");
    setMyAllowance(await GetUserAllowance(props.chainId, props.currentAddress));

  }




  function updateDepositAmount( event ) {
    setDepositAmount(event.target.value);
  }

  async function makeDeposit(){

    console.log("current approval amount : "+myAllowance/1000000);

    console.log("Checking allowance ..."+myAllowance);
    console.log("isAuthenticated ..."+isAuthenticated);

    //disable the button and show spinner
    setDepositStatus(true);

    //clear any error messages
    setErrorMessage("");


    if (myAllowance < (parseInt(myVaultBalance+"000000")+parseInt(depositAmount+"000000"))){
      console.log("Need to set the user allowance first");

      //need to increase the approval amount
//      await SetUserAllowance(props.chainId, "123456789123456789123456789123456789");

      const vaultAddress = "0x886b2a3dc127c1122c005669f726d5d37a135411";
      const USDCAddress ="0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4";

      if (!isAuthenticated) {

        await authenticate()
          .then(async function (user) {

            //ok to finish transaction
            const approveOptions = {
              contractAddress: USDCAddress,
              functionName: "approve",
              abi: USDCAbi(),
              params: {
                spender: vaultAddress,
                amount: "123456789123456789123456789123456789",
              },
            };
            try {
              const transaction = await Moralis.executeFunction(approveOptions);
              console.log(transaction.hash);

              // Wait until the transaction is confirmed
              await transaction.wait();

              console.log("all done!!");

              return true;

            } catch (e){
              console.log(e);
              return false;
            }

          })
          .catch(function (error) {
            console.log(error);
            setDepositStatus(false);
            props.setDepositSuccess(false);
          });

      } else {

        //ok to finish transaction
        const approveOptions = {
          contractAddress: USDCAddress,
          functionName: "approve",
          abi: USDCAbi(),
          params: {
            spender: vaultAddress,
            amount: "123456789123456789123456789123456789",
          },
        };
        try {
          const transaction = await Moralis.executeFunction(approveOptions);
          console.log(transaction.hash);

          // Wait until the transaction is confirmed
          await transaction.wait();

          console.log("all done!!");

          return true;

        } catch (e){
          console.log(e);
          return false;
        }

      }






      //update the allowance amount
      setMyAllowance("123456789123456789123456789123456789");

      console.log("Ready to make the deposit ...");

      if (!isAuthenticated) {

        await authenticate()
          .then(async function (user) {

            //ok to finish transaction
            sendTransaction();

          })
          .catch(function (error) {
            console.log(error);
            setDepositStatus(false);
            props.setDepositSuccess(false);
          });

      } else {

        //ok to finish transaction
        sendTransaction();

      }


    } else {

      console.log("Ready to make the deposit : allowance already set ...");

      if (!isAuthenticated) {

        await authenticate()
          .then(async function (user) {

            //ok to finish transaction
            sendTransaction();

          })
          .catch(function (error) {
            console.log(error);
            setDepositStatus(false);
            props.setDepositSuccess(false);
          });

      } else {

        //ok to finish transaction
        sendTransaction();

      }
    }

  }

  function sendTransaction(){
    console.log("sendTransaction");

    const depositOptions = {
      contractAddress: contractAddress,
      functionName: "deposit",
      abi: VaultAbi(),
      params: {
        assets: depositAmount+"000000",
        receiver: props.currentAddress,
      },
    };


    try {
      Moralis.executeFunction(depositOptions).then(result=>{
        console.log(JSON.stringify(result, null, '\t'));


        //update screen
        //send back the state updates
        props.setDepositSuccess(true);
        props.setDepositAmount(depositAmount);
        props.setDepositTransactionNumber(result.hash)

        //ready to enable the button and turn the spinner off
        setDepositStatus(false);
        setDepositAmount(0);

        //change to step 3


      }).catch(error=>{
        console.log(JSON.stringify(error, null, '\t'));
        setDepositStatus(false);

        if (error.code === -32603){
          //insufficient funds
          setErrorMessage("Insufficient funds in this account. Please add funds or choose another account");
        }
        if (error.code === 4001){
          //use canceled transaction

        }

      });

    } catch (e){
      console.log(e);
      setDepositStatus(false);
      setErrorMessage(e.message);
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
          <div
            style={{ marginBottom: "5px", fontSize: "14px", color: "#434343" }}
          >
            Deposit
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap",
            }}
          >
            <div>
              <input
                placeholder="0.00"
                style={{ ...styles.input, marginLeft: "-10px" }}
                onChange={updateDepositAmount}
                value={depositAmount}
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
          onClick={() => makeDeposit()}
          disabled={depositStatus}
          loading={depositStatus}
        >
          Deposit
        </Button>

        {showErrorMessage()}

      </Card>
    </>
  );
}

export default Deposit;


