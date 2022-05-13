
import React, { useEffect, useState } from "react";

import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall, useWeb3Transfer } from "react-moralis";
import Moralis from "moralis";

import { Col, Row, Layout, Card, Table, Button, Input } from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";
import Vault, { VaultEvents } from "./Contracts/Vault";
import GetUserAllowance, { SetUserAllowance } from "./Contracts/USDC";
import VaultTransactions from "./Contracts/VaultTransactions";
import USDCAbi from "./ContractABIs/USDCAbi";
import VaultLiveQueriesDeposits from "./Contracts/VaultTransactions";



const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "12px",
    fontWeight: "500",
  },
};


const Dashboard = () => {

  const Web3Api = useMoralisWeb3Api();


  /*
      for the Vault
   */
  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");

  const [ vaultDepositTransactions, setVaultDepositTransactions ] = useState([]);
  const [ vaultWithdrawalTransactions, setVaultWithdrawalTransactions ] = useState([]);

  /*
      for the User
   */
  const [ myAllowance, setMyAllowance ] = useState(0);
  const [ myVaultBalance, setMyVaultBalance ] = useState(0);
  const [ myVaultTotalUserBalance, setMyVaultTotalUserBalance ] = useState(0);
  const [ amountEarned, setAmountEarned ] = useState(0);
  const [ depositAmount, setDepositAmount ] = useState(0);
  const [ withdrawalAmount, setWithdrawalAmount ] = useState(0);
  const [ myTransactions, setMyTransactions ] = useState([]);
  const [ depositStatus, setDepositStatus ] = useState(false);
  const [ withdrawalStatus, setWithdrawalStatus ] = useState(false);

  const { user, account, chainId } = useMoralis();


  console.log("------------------------ : "+chainId);



  useEffect(()=>{
    console.log("the user account : "+account);

    if (account !== null){
      getUserDetails();
    }

    getVaultDepositTransactions();
    getVaultWithdrawalTransactions();

  }, [chainId, account]);

  //get user details
  async function getUserDetails(){
    console.log("getUserDetails : "+account);
    console.log("chainId : "+chainId);

    const balance_of_options = {
      chain: chainId,
      address: contractAddress,
      function_name: "balanceOf",
      abi: VaultAbi(),
      params: {
        '': account
      },
    };
    const balance_of = await Moralis.Web3API.native.runContractFunction(balance_of_options);
    console.log("-------------- balance : "+balance_of);
    console.log("My Vault Balance : "+balance_of/1000000);
    setMyVaultBalance(balance_of/1000000);

    const total_user_balance_options = {
      chain: chainId,
      address: contractAddress,
      function_name: "totalUserBalance",
      abi: VaultAbi(),
      params: {
        "owner": account
      },
    };
    const total_user_balance = await Moralis.Web3API.native.runContractFunction(total_user_balance_options);
    console.log("-------------- total_user_balance : "+total_user_balance);
    console.log("My total user Balance : "+total_user_balance/1000000);
    setMyVaultTotalUserBalance(total_user_balance/1000000);






    setWithdrawalAmount(balance_of/1000000);


    console.log("Get the Allowance");
    setMyAllowance(await GetUserAllowance(chainId, account));

/*
    //get the prefix for the network
    let networkName = "rinkeby";
    switch (chainId){
      case "0x1":
        networkName="mainnet";
        break;
      case "0x4":
        networkName="rinkeby";
        break;
      default:
    }

    const rpcURL = "https://"+networkName+".infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
    const web3 = new Web3(rpcURL);
    const contract = await new web3.eth.Contract(VaultAbi(), contractAddress);

    console.log("Got the Contract!!");
    setMyAllowance(await GetUserAllowance(chainId, account));

    contract.methods.balanceOf(account).call((err, result) => {
      console.log("My Vault Balance : "+result/1000000);
      setMyVaultBalance(result/1000000);
      setWithdrawalAmount(result/1000000);
    });
*/


    const fetchTransactions = async () => {

      // get network transactions for a given address
      // with most recent transactions appearing first
      const options = {
        chain: chainId,
        address: account,
        order: "desc",
        limit: 10
      };


      const rinkebyTransactions = await Web3Api.account.getTransactions(options);

      setMyTransactions(rinkebyTransactions.result);

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


    //disable the button and show spinner
    setDepositStatus(true);

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

        //ready to enable the button and turn the spinner off
        setDepositStatus(false);


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

        //ready to enable the button and turn the spinner off
        setDepositStatus(false);

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

    //get the vault holdings
    const options = {
      chain: chainId,
      address: contractAddress,
      function_name: "thisVaultsHoldings",
      abi: VaultAbi(),
    };
    const vaultHoldings = await Moralis.Web3API.native.runContractFunction(options);
    console.log("vault holdings : "+vaultHoldings);

    if (vaultHoldings >= parseInt(withdrawalAmount+"000000")){
      console.log("YAY! enough funds to cover the withdrawal");


      //disable the button and show spinner
      setWithdrawalStatus(true);


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

        //ready to enable the button and turn the spinner off
        setWithdrawalStatus(false);

      } catch (e){
        console.log(e);
      }


    } else {
      //some level of delayed payout is going to happen
      console.log("!! ALERT - not enough in vault to cover this withdrawal");
      //see if they want to proceed with the withdrawal



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
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  function checkMyTransaction(transaction) {
    return (transaction.from_address===account || transaction.to_address===account);
  }

  const table_rows = myTransactions.filter(checkMyTransaction).map((transaction, i)=>{

    return {
      key: i,
      block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>,
      from_address: transaction.from_address.substring(0,4)+"..."+transaction.from_address.substring(transaction.from_address.length-4, transaction.from_address.length),
      to_address: transaction.to_address.substring(0,4)+"..."+transaction.to_address.substring(transaction.to_address.length-4, transaction.to_address.length),
      amount: transaction.value/1000000,
    }
  });


  console.log("SavorDashboardContent");




  const getVaultDepositTransactions = () => {

    const ABI = {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "caller", "type": "address" }, {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      }, { "indexed": false, "internalType": "uint256", "name": "assets", "type": "uint256" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256",
      }],
      "name": "Deposit",
      "type": "event",
    };
    const fetchContractDepositEvents = async () => {

      console.log("getting contract deposit events ...");

      const options = {
        chain: chainId,
        address: contractAddress,
        topic: "Deposit(address, address, uint256, uint256)",
        abi: ABI,
      };
      const events = await Web3Api.native.getContractEvents(options);
      setVaultDepositTransactions(events.result);
    };
    fetchContractDepositEvents();
  }


  const getVaultWithdrawalTransactions = () => {

    const ABI = {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "caller", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "assets", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "shares", "type": "uint256" }],
      "name": "Withdraw",
      "type": "event",
    };
    const fetchContractWithdrawalEvents = async () => {

      console.log("getting contract withdrawal events ...");

      const options = {
        chain: chainId,
        address: contractAddress,
        topic: "Withdraw(address, address, address, uint256, uint256)",
        abi: ABI,
      };
      const events = await Web3Api.native.getContractEvents(options);
      setVaultWithdrawalTransactions(events.result);
    };
    fetchContractWithdrawalEvents();
  }



  /*
  for the vault transactions table
*/
  const vault_columns = [
    {
      title: 'Timestamp',
      dataIndex: 'block_timestamp',
      key: 'timestamp',
    },
    {
      title: 'Who',
      dataIndex: 'caller',
      key: 'caller',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
    },
  ];

  const vault_deposit_table_rows = vaultDepositTransactions.map((transaction, i)=>{

    const _data = transaction.data;

    return {
      key: i,
      block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>,
      caller: _data.caller.substring(0,4)+"..."+_data.caller.substring(_data.caller.length-4, _data.caller.length),
      amount: <NumberFormat prefix="$" value={_data.assets/1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
    }
  });


  const vault_withdrawal_table_rows = vaultWithdrawalTransactions.map((transaction, i)=>{

    const _data = transaction.data;

    return {
      key: i,
      block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>,
      caller: _data.caller.substring(0,4)+"..."+_data.caller.substring(_data.caller.length-4, _data.caller.length),
      amount: <NumberFormat prefix="$" value={_data.assets/1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
    }
  })









  return(

    <Layout>
      <Row>

        <Col md={6} sm={24} xs={24}>

          <Vault myVaultBalance={myVaultBalance}/>

        </Col>

        <Col md={6} sm={24} xs={24}>
          <Card style={styles.card} title="My Account" bodyStyle={{ padding: "18px", fontSize:"12px" }}>
            <Row>
              <Col span={12}>Allowance : </Col>
              <Col span={12} style={{textAlign:"end"}}>{ myAllowance===0?0:"Maximum" } </Col>
            </Row>

            <Row>
              <Col span={12}>Balance : </Col>
              <Col span={12} style={{textAlign:"end"}}>${ <NumberFormat
                value={(myVaultBalance+(myVaultTotalUserBalance-myVaultBalance))}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true} /> }</Col>
            </Row>

            <Row>
              <Col span={16}>Pending Payout : </Col>
              <Col span={8} style={{textAlign:"end"}}>${ <NumberFormat
                value={(myVaultTotalUserBalance-myVaultBalance)}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true} /> }</Col>
            </Row>

            <Row>
              <Col span={12}>Amount Earned : </Col>
              <Col span={12} style={{textAlign:"end"}}>${ amountEarned } </Col>
            </Row>

            <Row>
              <Col span={12}>Network : </Col>
              <Col span={12} style={{textAlign:"end"}}>{chainId}</Col>
            </Row>

            <Row>
              <Col span={12}>Wallet Address : </Col>
              <Col span={12} style={{textAlign:"end"}}>{ account?account.substring(0,4)+"..."+account.substring(account.length-4, account.length):"" }</Col>
            </Row>


          </Card>
        </Col>

        <Col md={6} sm={24} xs={24}>
          <Card style={styles.card} title="Deposit Testing" bodyStyle={{ padding: "18px" }}>
            <Input onChange={ updateDepositAmount } value={ depositAmount>0?depositAmount:"" } suffix="USDC" />
            <Button
              type="primary"
              size="small"
              style={{
                width: "100%",
                marginTop: "15px",
                borderRadius: "0.6rem",
                height: "50px",
              }}
              onClick={ makeDeposit }
              disabled={depositStatus}
            >
              Make Deposit
            </Button>

            <p>{ depositStatus }</p>
          </Card>
        </Col>

        <Col md={6} sm={24} xs={24}>
          <Card style={styles.card} title="Withdrawal Testing" bodyStyle={{ padding: "18px" }}>
            <Input onChange={ updateWithdrawalAmount } value={ withdrawalAmount>0?withdrawalAmount:"" } suffix="USDC" />

            <Button
              type="primary"
              size="small"
              style={{
                width: "100%",
                marginTop: "15px",
                borderRadius: "0.6rem",
                height: "50px",
              }}
              onClick={ makeWithdrawal }
              disabled={ withdrawalStatus }
            >
              Make Withdrawal
            </Button>

            <p>{ withdrawalStatus }</p>
          </Card>
        </Col>

      </Row>

      {/*
        <Row>
          <Col span={24}>
            <Table dataSource={table_rows} columns={columns} />;
          </Col>
        </Row>
      */}

      <Row>
        <Col span={24}>
          <VaultLiveQueriesDeposits chainId={chainId}/>
        </Col>
      </Row>



      <Row>
        <Col span={12} >
          <Card style={styles.card} title="Deposits">
            <Table dataSource={vault_deposit_table_rows} columns={vault_columns} />;
          </Card>
        </Col>
        <Col span={12} >
          <Card style={styles.card} title="Withdrawals">
            <Table dataSource={vault_withdrawal_table_rows} columns={vault_columns} />;
          </Card>
        </Col>
      </Row>

    </Layout>


  );
};

export default Dashboard;


