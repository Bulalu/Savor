import React, { useMemo, useState } from "react";
import Moralis from "moralis";
import { useMoralis, useTokenPrice } from "react-moralis";
import VaultAbi from "./VaultAbi";

import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";

import { ethers } from "ethers";
import Web3 from 'web3';


const Dashboard = () => {

  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

  const [ depositAmount, setDepositAmount ] = useState(0);
  const [ amountEarned, setAmountEarned ] = useState(0);
  const [ apy, setApy ] = useState(0.0);

  const [ amountToDeposit, setAmountToDeposit ] = useState(0);
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [quote, setQuote] = useState();
  const [currentTrade, setCurrentTrade] = useState();
  const { fetchTokenPrice } = useTokenPrice();
  const [tokenPricesUSD, setTokenPricesUSD] = useState({});

  let pendingDepositAmount = false;
  let pendingAmountEarned = false;
  let pendingApy = false;

  /*
      what do we need for the dashboard
   */

  //make a connection to the Vault Contract
  const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
  const web3 = new Web3(rpcURL);

  const address = "0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3";
  const contract = new web3.eth.Contract(VaultAbi(), address)
//    console.log("contract", instance);
  console.log("address", contract.address);
  console.log("methods", contract.methods);


  //get the Vault name
  contract.methods.name().call((err, result) => {
    console.log("the contract name : "+result);
  });

  //get the Vault fee percentage
  contract.methods.feePercent().call((err, result) => {
    console.log("the contract fee percent : "+result);
  });

  //get the deposited amount
  contract.methods.balanceOf("0x0df4Abb835a455ECA82cf92Ea194526e80E6Ce09").call((err, result) => {
    console.log("my vault balance : "+result);
    setDepositAmount(result);
  });




  const fromTokenPriceUsd = useMemo(
    () =>
      tokenPricesUSD?.[fromToken?.["address"]]
        ? tokenPricesUSD[fromToken?.["address"]]
        : null,
    [tokenPricesUSD, fromToken],
  );

  const toTokenPriceUsd = useMemo(
    () =>
      tokenPricesUSD?.[toToken?.["address"]]
        ? tokenPricesUSD[toToken?.["address"]]
        : null,
    [tokenPricesUSD, toToken],
  );

  const fromTokenAmountUsd = useMemo(() => {
    if (!fromTokenPriceUsd || !fromAmount) return null;
    return `~$ ${(fromAmount * fromTokenPriceUsd).toFixed(4)}`;
  }, [fromTokenPriceUsd, fromAmount]);

  const toTokenAmountUsd = useMemo(() => {
    if (!toTokenPriceUsd || !quote) return null;
    return `~$ ${(
      Moralis?.Units?.FromWei(quote?.toTokenAmount, quote?.toToken?.decimals) *
      toTokenPriceUsd
    ).toFixed(4)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toTokenPriceUsd, quote]);


  function depositAmountChange(e){
    e.preventDefault();

    setAmountToDeposit(e.target.value);
    console.log("the amount to deposit : "+e.target.value);

  }

  async function makeDeposit(){
    console.log("make deposit");

    /*
        1. need the Vault reference
        2. need wallet access
     */


    if (!isAuthenticated) {
      await authenticate({signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));

          console.log("User : " + JSON.stringify(user));
          console.log("Account : " + account);
          console.log("getUsername : " + user.getUsername());
          console.log("createdAt : " + user.createdAt);
          console.log("user authData : " + user.get("authData"));
          const authData = user.get("authData");
          const moralisEth = authData.moralisEth;
          const user_id = moralisEth.id;

          console.log("user id : " + user_id);
          console.log("user accounts : " + user.get("accounts"));

          setAccounts(user.get("accounts"));

          console.log("the new accounts : "+accounts);

          getAccountBalances();

          async function makeDepositNow(){
            console.log("makedepositNow");
            try {
              const provider = new ethers.providers.Web3Provider("https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb");
              await provider.send("eth_requestAccounts", []);
              const signer = provider.getSigner();

              const tx = signer.sendTransaction({
                to: "0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3",
                value: ethers.utils.parseEther("1.0")
              });

            } catch (e) {
              console.log("!!!!!!!!!! "+e);
            }
          }
          makeDepositNow();

        })
        .catch(function (error) {
          console.log(error);
        });

    } else {
      console.log("user wallet already connected");


    }





  }



  return (
        <>

            <h3>Testing area for Vault Contract</h3>

            <div>
              <div>Deposit Amount : ${depositAmount}</div>
              <div>Amount Earned : ${amountEarned}</div>
              <div>Current APY : {apy}%</div>

            </div>


            <div>Make deposit into Vault</div>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>

              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Enter Deposit Amount
                  </Typography>



              <div>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    value={amountToDeposit}
                    onChange={depositAmountChange}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Amount"
                  />
                </FormControl>
              </div>
              <Button
                variant="contained"
                size="small"
                color="success"
                endIcon={<SendIcon />}
                onClick={makeDeposit}>
                Deposit
              </Button>


                </CardContent>
              </Card>
            </Box>

            <div>Withdrawal from Vault</div>



            <div>Get some ether from the faucet</div>



    </>
  );
};

export default Dashboard;

