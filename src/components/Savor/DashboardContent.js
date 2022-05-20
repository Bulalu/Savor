
import React, { useEffect, useState } from "react";

import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Moralis from "moralis";

import { Col, Row, Layout, Card, Table, Button, Input, Collapse, Image, Avatar } from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";
import Vault from "./Contracts/Vault";
import GetUserAllowance, { SetUserAllowance } from "./Contracts/USDC";
import { VaultLiveQueriesWithdraws } from "./Contracts/VaultTransactions";
import VaultLiveQueriesDeposits from "./Contracts/VaultTransactions";
import { getEllipsisTxt } from "../../helpers/formatters";
import ChainNetworks from "./Wallet/Networks";


const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "12px",
    fontWeight: "500",
  },
};


const DashboardContent = (props) => {

  const Web3Api = useMoralisWeb3Api();
  const { authenticate, isAuthenticated, user } = useMoralis();

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
  const [ myDepositCount, setMyDepositCount ] = useState(0);
  const [ myWithdrawalCount, setMyWithdrawalCount ] = useState(0);


  console.log("------------------------ : "+props.chainId+" : "+props.currentAddress);


  useEffect(()=>{
    console.log("useEffect chainId and currentAddress : "+props.chainId+" : "+props.currentAddress);

    if (props.currentAddress !== ""){
      getUserDetails();
    }

    if (props.chainId !== "") {
      getVaultDepositTransactions();
      getVaultWithdrawalTransactions();
    }

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
    const balance_of = await Moralis.Web3API.native.runContractFunction(balance_of_options);
    console.log("-------------- balance : "+balance_of);
    console.log("My Vault Balance : "+balance_of/1000000);
    setMyVaultBalance(balance_of/1000000);

    const total_user_balance_options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "totalUserBalance",
      abi: VaultAbi(),
      params: {
        "owner": props.currentAddress
      },
    };
    const total_user_balance = await Moralis.Web3API.native.runContractFunction(total_user_balance_options);
    console.log("-------------- total_user_balance : "+total_user_balance);
    console.log("My total user Balance : "+total_user_balance/1000000);
    setMyVaultTotalUserBalance(total_user_balance/1000000);

    setWithdrawalAmount(balance_of/1000000);

    console.log("Get the Allowance");
    setMyAllowance(await GetUserAllowance(props.chainId, props.currentAddress));

  }




  function updateDepositAmount(event){
    setDepositAmount(event.target.value);
  }


  async function makeDeposit(){

    console.log("current approval amount : "+myAllowance/1000000);

    console.log("Checking allowance ...");
    console.log("isAuthenticated ..."+isAuthenticated);

    //disable the button and show spinner
    setDepositStatus(true);

    if (myAllowance < (parseInt(myVaultBalance+"000000")+parseInt(depositAmount+"000000"))){
      //need to increase the approval amount
      await SetUserAllowance(props.chainId, "123456789123456789123456789123456789");
      //update the allowance amount
      setMyAllowance("123456789123456789123456789123456789")

      console.log("Ready to make the deposit ...");





      if (!isAuthenticated) {

        await authenticate()
          .then(async function (user) {

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
              const transaction = await Moralis.executeFunction(depositOptions);
              console.log(transaction.hash);

              // Wait until the transaction is confirmed
              await transaction.wait();

              //update screen
              getUserDetails();

              //ready to enable the button and turn the spinner off
              setDepositStatus(false);
              setDepositAmount(0);

            } catch (e){
              console.log(e);
              setDepositStatus(false);
            }
          })
          .catch(function (error) {
            console.log(error);
            setDepositStatus(false);
          });

      } else {

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
          const transaction = await Moralis.executeFunction(depositOptions);
          console.log(transaction.hash);

          // Wait until the transaction is confirmed
          await transaction.wait();

          //update screen
          getUserDetails();

          //ready to enable the button and turn the spinner off
          setDepositStatus(false);
          setDepositAmount(0);

        } catch (e){
          console.log(e);
          setDepositStatus(false);
        }
      }


    } else {

      console.log("Ready to make the deposit 1 ...");

      if (!isAuthenticated) {

        await authenticate()
          .then(async function (user) {

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
              const transaction = await Moralis.executeFunction(depositOptions);
              console.log(transaction.hash);

              // Wait until the transaction is confirmed
              await transaction.wait();

              //update screen
              getUserDetails();

              //ready to enable the button and turn the spinner off
              setDepositStatus(false);
              setDepositAmount(0);

            } catch (e){
              console.log(e);
              setDepositStatus(false);

            }
          })
          .catch(function (error) {
            console.log(error);
            setDepositStatus(false);
          });
      } else {

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
          const transaction = await Moralis.executeFunction(depositOptions);
          console.log(transaction.hash);

          // Wait until the transaction is confirmed
          await transaction.wait();

          //update screen
          getUserDetails();

          //ready to enable the button and turn the spinner off
          setDepositStatus(false);
          setDepositAmount(0);

        } catch (e){
          console.log(e);
          setDepositStatus(false);
        }

      }
    }

  }


  function updateWithdrawalAmount(event){
    setWithdrawalAmount(event.target.value);
  }

  async function makeWithdrawal(){


    //get the vault holdings
    const options = {
      chain: props.chainId,
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
          receiver: props.currentAddress,
          owner: props.currentAddress
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
    return (transaction.from_address===props.currentAddress || transaction.to_address===props.currentAddress);
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
        chain: props.chainId,
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
        chain: props.chainId,
        address: contractAddress,
        topic: "Withdraw(address, address, address, uint256, uint256)",
        abi: ABI,
      };
      const events = await Web3Api.native.getContractEvents(options);
      setVaultWithdrawalTransactions(events.result);
    };
    fetchContractWithdrawalEvents();
  }




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

//    console.log("deposit transactions : "+JSON.stringify(transaction));
    const data = transaction.data;

    return {
      key: i,
      block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>,
      caller: getEllipsisTxt(data.owner, 6),
      amount: <NumberFormat prefix="$" value={data.assets / 1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
    }
  });


  const vault_withdrawal_table_rows = vaultWithdrawalTransactions.map((transaction, i)=>{

//    console.log("withdrawal transactions : "+JSON.stringify(transaction));
    const data = transaction.data;

    return {
      key: i,
      block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>,
      caller: getEllipsisTxt(data.receiver, 6),
      amount: <NumberFormat prefix="$" value={data.assets / 1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
    }
  })



  const networkName = ChainNetworks()
    .filter((network)=> network.key === props.chainId)
    .map((network)=> network.value);

  const { Panel } = Collapse;

  function callback(key) {
    console.log(key);
  }


  return(

    <Layout>

      <Row>
        <Col md={24} sm={24} xs={24}>
          <Collapse defaultActiveKey={['1']} onChange={callback}>

            <Panel header="My Account" key="1">
              <Col md={24} sm={24} xs={24}>

                <Card style={styles.card} bodyStyle={{ padding: "18px", fontSize:"12px" }}>
                  <Row gutter={[8, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                    <Col md={8} sm={24} xs={24}>
                      <Card style={styles.card} title={"Balance"} bodyStyle={{ padding: "18px", fontSize:"18px", color:"rgb(33, 191, 150)", }}>
                        <Col span={24} style={{textAlign:"end"}}>
                          ${
                          <NumberFormat
                            value={(myVaultBalance+(myVaultTotalUserBalance-myVaultBalance))}
                            displayType={'text'}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale={true} />
                        }
                        </Col>
                      </Card>
                    </Col>
                    <Col md={8} sm={24} xs={24}>
                      <Card style={styles.card} title={"Pending Payout"} bodyStyle={{ padding: "18px", fontSize:"18px", color:"#1890ff" }}>
                        <Col span={24} style={{textAlign:"end"}}>
                          ${
                          <NumberFormat
                            value={(myVaultTotalUserBalance-myVaultBalance)}
                            displayType={'text'}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale={true} />
                        }
                        </Col>
                      </Card>
                    </Col>
                    <Col md={8} sm={24} xs={24}>
                      <Card style={styles.card} title={"Amount earned:"} bodyStyle={{ padding: "18px", fontSize:"18px", color:"orange" }}>
                        <Col span={24} style={{textAlign:"end"}}>
                          ${ amountEarned }
                        </Col>
                      </Card>
                    </Col>
                  </Row>

                  <Row style={{marginTop:"20px"}}>
                    <Col span={12}>Allowance : </Col>
                    <Col span={12} style={{textAlign:"end"}}>{ myAllowance===0?0:"Maximum" } </Col>
                  </Row>

                  <Row>
                    <Col span={12}>Network : </Col>
                    <Col span={12} style={{textAlign:"end"}}>
                      {networkName}
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12}>Address : </Col>
                    <Col span={12} style={{textAlign:"end"}}>{ getEllipsisTxt(props.currentAddress, 4) }</Col>
                  </Row>
                </Card>

              </Col>
            </Panel>

            <Panel header="Savor Vault" key="2" forceRender="true">
              <Col md={24} sm={24} xs={24}>
                <Vault
                  chainId={props.chainId}
                  myVaultBalance={myVaultBalance}
                />
              </Col>
            </Panel>

            <Panel
              header={myDepositCount>0?'Deposits '+myDepositCount:'Deposits'} key="3" forceRender="true">

              <Col span={24}>
                <Card style={styles.card} title="Deposits (Chain)">
                  <Table dataSource={vault_deposit_table_rows} columns={vault_columns} />
                </Card>
              </Col>
              <Col span={24}>
                <VaultLiveQueriesDeposits
                  chainId={props.chainId}
                  setMyDepositCount={setMyDepositCount}
                />
              </Col>
            </Panel>

            <Panel header={`Withdrawals ${myWithdrawalCount>0?myWithdrawalCount:''}`} key="4" forceRender="true">
              <Col span={24} >
                <Card style={styles.card} title="Withdrawals (Chain)">
                  <Table dataSource={vault_withdrawal_table_rows} columns={vault_columns} />
                </Card>
              </Col>
              <Col span={24} >
                <VaultLiveQueriesWithdraws
                  chainId={props.chainId}
                  setMyWithdrawalCount={setMyWithdrawalCount}
                />
              </Col>
            </Panel>

          </Collapse>
        </Col>



        {/*
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
        </Col>*/}

        {/*<Col md={6} sm={24} xs={24}>
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
        </Col>*/}



        {/*
        <Row>
          <Col span={24}>
            <Table dataSource={table_rows} columns={columns} />;
          </Col>
        </Row>
      */}

      </Row>

    </Layout>

  );
};

export default DashboardContent;

