import React, { useMemo, useState } from "react";
import Moralis from "moralis";
import { useMoralis, useTokenPrice, useApiContract } from "react-moralis";
import VaultAbi from "./VaultAbi";


import { ethers } from "ethers";
import Web3 from "web3";
import ErrorMessage from "./ErrorMessage";


const Dashboard = () => {

  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout, chainId } = useMoralis();

  const [depositAmount, setDepositAmount] = useState(0);
  const [amountEarned, setAmountEarned] = useState(0);
  const [apy, setApy] = useState(0.0);

  const [amountToDeposit, setAmountToDeposit] = useState(0);
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [quote, setQuote] = useState();
  const [currentTrade, setCurrentTrade] = useState();
  const { fetchTokenPrice } = useTokenPrice();
  const [tokenPricesUSD, setTokenPricesUSD] = useState({});



  /*
      what do we need for the dashboard
   */

  const {
    runContractFunction,
    data,
    error,
    isLoading,
    isFetching,
  } = useApiContract({
    address: "0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3",
    functionName: "name",
    abi: VaultAbi(),
    chain: "0x4",
    params: {},
  });


  //make a connection to the Vault Contract
  const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
  const web3 = new Web3(rpcURL);

  const address = "0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3";
  const contract = new web3.eth.Contract(VaultAbi(), address);
//    console.log("contract", instance);
  console.log("address", contract.address);
  console.log("methods", contract.methods);


  //get the Vault name
  contract.methods.name().call((err, result) => {
//    console.log("the contract name : "+result);
  });

  //get the Vault fee percentage
  contract.methods.feePercent().call((err, result) => {
//    console.log("the contract fee percent : "+result);
  });

  //get the deposited amount
  contract.methods.balanceOf("0x0df4Abb835a455ECA82cf92Ea194526e80E6Ce09").call((err, result) => {
//    console.log("my vault balance : "+result);
    setDepositAmount(result);
  });




  console.log("logged in user : ", user);
  console.log("account : ", account);
  console.log("isAuthenticated : ", isAuthenticated);
  console.log("chainId : ", chainId);


  function depositAmountChange(e) {
    e.preventDefault();

    setAmountToDeposit(e.target.value);
    console.log("the amount to deposit : " + e.target.value);

  }

  async function makeDeposit() {
    console.log("make deposit");

    /*
        1. need the Vault reference
        2. need wallet access
     */

  }


  return (
    <>

      <h3>Testing area for Vault Contract</h3>

      <div>
        <div>Deposit Amount : ${depositAmount}</div>
        <div>Amount Earned : ${amountEarned}</div>
        <div>Current APY : {apy}%</div>

      </div>

      <div>
        {error && <ErrorMessage error={error} />}
        <button onClick={() => runContractFunction()} disabled={isFetching}>Get contract Name</button>
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>


      <div>Make deposit into Vault</div>


      <div>Withdrawal from Vault</div>


      <div>Get some ether from the faucet</div>


    </>
  );
};

export default Dashboard;

