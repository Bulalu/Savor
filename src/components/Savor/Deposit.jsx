import React, {useEffect, useState} from "react";
import Web3 from "web3";
import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api, useWeb3Transfer } from "react-moralis";
import Moralis from "moralis";

import { Col, Row, Layout, Card, Table, InputNumber, Button } from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";
import Vault, { VaultEvents } from "./Contracts/Vault";
import GetUserAllowance, { SetUserAllowance } from "./Contracts/USDC";

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

const Deposit = () => {

  const Web3Api = useMoralisWeb3Api();

  /*
      for the Vault
   */
  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");
  const [ vaultName, setVaultName ] = useState("");
  const [ vaultSupply, setVaultSupply ] = useState(0);
  const [ vaultAssets, setVaultAssets ] = useState(0);
  const [ vaultAPY, setVaultAPY ] = useState(5.87);
  const [ lastHarvest, setLastHarvest ] = useState(0);
  const [ vaultTransactions, setVaultTransactions ] = useState([]);

  /*
      for the User
   */
  const [ myAllowance, setMyAllowance ] = useState(0);
  const [ myVaultBalance, setMyVaultBalance ] = useState(0);
  const [ amountEarned, setAmountEarned ] = useState(0);
  const [ depositAmount, setDepositAmount ] = useState([]);
  const [ withdrawalAmount, setWithdrawalAmount ] = useState(0);
  const [ myTransactions, setMyTransactions ] = useState([]);
  const [ depositStatus, setDepositStatus ] = useState("");
  const [ withdrawalStatus, setWithdrawalStatus ] = useState("");

  const { user, account, chainId } = useMoralis();

  console.log("------------------------ : "+chainId);

  useEffect(()=>{
    console.log("the user account : "+account);

    if (account !== null){
      getUserDetails();
    }

  }, [account]);

  //get user details
  async function getUserDetails(){

    console.log("getUserDetails");

    const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
    const web3 = new Web3(rpcURL);
    const contract = await new web3.eth.Contract(VaultAbi(), contractAddress);

    console.log("Got the Contract!!");
    setMyAllowance(await GetUserAllowance(chainId, account));

    contract.methods.balanceOf(account).call((err, result) => {
      console.log("My Vault Balance : "+result/1000000);
      setMyVaultBalance(result/1000000);
      setWithdrawalAmount(result/1000000);
    });

    const fetchTransactions = async () => {

      // get Rinkeby transactions for a given address
      // with most recent transactions appearing first
      const options = {
        chain: chainId,
        address: account,
        order: "desc",
        from_block: "0",
      };
      const rinkebyTransactions = await Web3Api.account.getTransactions(options);

      setMyTransactions(rinkebyTransactions.result);

      console.log(rinkebyTransactions.result);
    };
    fetchTransactions();
  }


  function updateDepositAmount( event ) {
    setDepositAmount(event.target.value);
  }

  async function makeDeposit() {
    /*
      ** requirements **

      network provider
      signer
      wallet address
      contract
      deposit amount (assets)
      allowance

      ** to-do **
      check boundaries

      - check the allowance amount - otherwise need to do an approval before making deposit

    */

    console.log("current approval amount : "+myAllowance/1000000);

    console.log("Checking allowance ...");

    if (myAllowance < (parseInt(myVaultBalance+"000000")+parseInt(depositAmount+"000000"))){
      //need to increase the approval amount
      await SetUserAllowance(chainId, "123456789123456789123456789123456789");
      //update the allowance amount
      setMyAllowance("123456789123456789123456789123456789")

      console.log("Ready to make the deposit ...");

      const depositOptions = {
        contractAddress: contractAddress,
        functionName: "deposit",
        abi: VaultAbi(),
        params: {
          assets: depositAmount+"000000",
          receiver: account,
        },
      };


      try {
        const transaction = await Moralis.executeFunction(depositOptions);
        console.log(transaction.hash);

        // Wait until the transaction is confirmed
        await transaction.wait();

        //update screen
        getUserDetails();

      } catch (e){
        console.log(e);
      }

    } else {

      console.log("Ready to make the deposit ...");

      const depositOptions = {
        contractAddress: contractAddress,
        functionName: "deposit",
        abi: VaultAbi(),
        params: {
          assets: depositAmount+"000000",
          receiver: account,
        },
      };

      try {
        const transaction = await Moralis.executeFunction(depositOptions);
        console.log(transaction.hash);

        // Wait until the transaction is confirmed
        await transaction.wait();

        //update screen
        getUserDetails();

      } catch (e){
        console.log(e);
      }
    }
  }

  function updateWithdrawalAmount(event){
    setWithdrawalAmount(event.target.value);
  }

  async function makeWithdrawal(){
  /*

    ** requirements **

    network provider
    signer
    wallet address
    contract
    withdrawal amount (assets)

    ** to-do **
    check to make sure values are within boundaries

      //check the allowance amount - otherwise need to do an approval before
   */

    //make the withdrawal
    const withdrawalOptions = {
      contractAddress: "0x886b2a3dc127c1122c005669f726d5d37a135411",
      functionName: "withdraw",
      abi: VaultAbi(),
      params: {
        assets: withdrawalAmount+"000000",
        receiver: account,
        owner: account
      },
    };

    try {
      const transaction = await Moralis.executeFunction(withdrawalOptions);
      console.log(transaction.hash);

      // Wait until the transaction is confirmed
      await transaction.wait();

      getUserDetails();

    } catch (e){
      console.log(e);
    }
  }


  /*
      for the transaction table
   */
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'block_timestamp',
      key: 'timestamp',
    },
    {
      title: 'From',
      dataIndex: 'from_address',
      key: 'from',
    },
    {
      title: 'To',
      dataIndex: 'to_address',
      key: 'to',
    },
  ];

  function checkMyTransaction(transaction) {
    return (transaction.from_address===account || transaction.to_address===account);
  }

  const table_rows = myTransactions.filter(checkMyTransaction).map((transaction, i)=>{

    return {
      key: i,
      block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>,
      from_address: transaction.from_address === account? "your wallet - "+transaction.from_address.substring(0,4)+"..."+transaction.from_address.substring(transaction.from_address.length-4, transaction.from_address.length): transaction.from_address,
      to_address: transaction.to_address === account? "your wallet - "+transaction.to_address.substring(0,4)+"..."+transaction.to_address.substring(transaction.to_address.length-4, transaction.to_address.length): transaction.to_address,
      receipt_gas_used: transaction.receipt_gas_used,
    }
  });


  console.log("SavorDashboardContent");

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
                bordered={false}
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
          //onClick={ makeDeposit }
          onClick={() => makeDeposit() }
          //disabled={!ButtonState.isActive}
        >
          Deposit
        </Button>
        <p>{ depositStatus }</p>
      </Card>




    </>
  );
};

export default Deposit;


