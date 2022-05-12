
import React, {useEffect, useState} from "react";
import Web3 from "web3";
import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api, useWeb3Transfer } from "react-moralis";
import Moralis from "moralis";

import {Col, Row, Layout, Card, Table} from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";
import Vault, { VaultEvents } from "./Contracts/Vault";
import GetUserAllowance, { SetUserAllowance } from "./Contracts/USDC";
import VaultTransactions from "./Contracts/VaultTransactions";



const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
  },
};


const Dashboard = () => {

  const Web3Api = useMoralisWeb3Api();

  /*
      for the Vault
   */
  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");

  /*
      for the User
   */
  const [ myAllowance, setMyAllowance ] = useState(0);
  const [ myVaultBalance, setMyVaultBalance ] = useState(0);
  const [ amountEarned, setAmountEarned ] = useState(0);
  const [ depositAmount, setDepositAmount ] = useState(0);
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

      console.log("my account transactions : "+rinkebyTransactions.result);
    };
    fetchTransactions();

  }




  function updateDepositAmount(event){
    setDepositAmount(event.target.value);
  }

  async function makeDeposit(){



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
      for the user transactions table
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
  })






  console.log("SavorDashboardContent");

  return(

    <Layout>
      <Row>

        <Col md={6} sm={24} xs={24}>

          <Vault myVaultBalance={myVaultBalance}/>

        </Col>

        <Col md={6} sm={24} xs={24}>
          <Card style={styles.card} title="My Account" bodyStyle={{ padding: "18px" }}>
            <h1>My Allowance : { myAllowance/1000000 }</h1>
            <h1>My Deposits : ${ <NumberFormat value={(myVaultBalance)} displayType={'text'} thousandSeparator={true} /> }</h1>
            <h1>Amount Earned : { amountEarned }</h1>
            <h1>Current Network : {chainId}</h1>
            <h1>Wallet Address : { account.substring(0,4)+"..."+account.substring(account.length-4, account.length) }</h1>
          </Card>
        </Col>

        <Col md={6} sm={24} xs={24}>
          <Card style={styles.card} title="Deposit Testing" bodyStyle={{ padding: "18px" }}>
            <input onChange={ updateDepositAmount } value={ depositAmount>0?depositAmount:"" } />
            <input type="button" onClick={ makeDeposit } value="Make Deposit (USDC)"/>

            <p>{ depositStatus }</p>
          </Card>
        </Col>

        <Col md={6} sm={24} xs={24}>
          <Card style={styles.card} title="Withdrawal Testing" bodyStyle={{ padding: "18px" }}>
            <input onChange={ updateWithdrawalAmount } value={ withdrawalAmount>0?withdrawalAmount:"" } />
            <input type="button" onClick={ makeWithdrawal } value="Make Withdrawal" />

            <p>{ withdrawalStatus }</p>
          </Card>
        </Col>

      </Row>

      <Row>
        <Col span={24}>

        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Table dataSource={table_rows} columns={columns} />;
        </Col>
      </Row>

    </Layout>


  );
};

export default Dashboard;


