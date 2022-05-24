
import React, { useEffect, useState } from "react";

import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Moralis from "moralis";

import { Col, Row, Card, Table, Collapse, Space, Badge } from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";

import GetUserAllowance, { SetUserAllowance } from "./Contracts/USDC";
import { VaultLiveQueriesWithdraws } from "./Contracts/Rinkeby/VaultTransactions";
import VaultLiveQueriesDeposits from "./Contracts/Rinkeby/VaultTransactions";
import { getEllipsisTxt } from "../../helpers/formatters";
import ChainNetworks from "./Wallet/Networks";
import Vault1 from "./Contracts/Vault1";
import DepositPage1 from "./DepositPage1";
import WithdrawPage1 from "./WithdrawPage1";



const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "500",
  },
  cardContentBoxAccount: {
    backgroundColor: "#ffffff",
    color: "#000000",
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "2px solid orange",
    borderRadius: "15px",
    marginRight: "10px",
    marginTop: "auto",
    marginBottom: "auto"
  },
  cardContentBoxAccountHeader: {
    fontSize: "16px"
  },
  cardContentBoxAccountContent: {
    fontSize: "14px",
    fontWeight: "600"
  },

};


const DashboardContent = (props) => {
  console.log("DashboardContent : "+JSON.stringify(props));

  const Web3Api = useMoralisWeb3Api();
  const { authenticate, isAuthenticated, user } = useMoralis();

  /*
      for the Vault
   */
  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");

  const [ vaultDepositTransactions, setVaultDepositTransactions ] = useState([]);
  const [ vaultWithdrawalTransactions, setVaultWithdrawalTransactions ] = useState([]);
  const [ vaultAssetsBreakdown, setVaultAssetsBreakdown ] = useState([]);

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
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
    },
  ];

  const vault_deposit_table_rows = vaultDepositTransactions.map((transaction, i)=>{

    const data = transaction.data;

    return {
      key: i,
      account: getEllipsisTxt(data.owner, 6),
      amount: <NumberFormat prefix="$" value={data.assets / 1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />,
      description: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>
    }
  });


  const vault_withdrawal_table_rows = vaultWithdrawalTransactions.map((transaction, i)=>{

    const data = transaction.data;

    return {
      key: i,
      account: getEllipsisTxt(data.receiver, 6),
      amount: <NumberFormat prefix="$" value={data.assets / 1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />,
      description: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>
    }
  });



  const networkName = ChainNetworks()
    .filter((network)=> network.key === props.chainId)
    .map((network)=> network.value);

  const { Panel } = Collapse;

  function callback(key) {
    console.log(key);
  }



  const panelDepositCount = () => (
    <Space>
      <Badge
        style={{backgroundColor: 'rgb(33, 191, 150)'}}
        count={vaultDepositTransactions.length}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </Space>
  );
  const panelWithdrawalCount = () => (
    <Space>
      <Badge
        style={{backgroundColor: 'rgb(33, 191, 150)'}}
        count={vaultWithdrawalTransactions.length}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </Space>
  );


  return(

    <Row>
      <Col md={24} sm={24} xs={24}>

        <Row gutter={[16 , 16]}>
          <Col md={16} sm={24} xs={24}>
            <Vault1
              chainId={props.chainId}
              myVaultBalance={myVaultBalance}
              setVaultAssetsBreakdown={setVaultAssetsBreakdown}
            />
          </Col>

          <Col md={8} sm={24} xs={24}>

            <Card style={styles.cardContentBoxAccount}>
              <Row style={styles.cardContentBoxAccountHeader}>
                My Balance
              </Row>
              <Row style={styles.cardContentBoxAccountContent}>
                <Col span={24} style={{textAlign:"end"}}>
                  {<NumberFormat
                    value={myVaultBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    style={{fontWeight:"600"}}
                  />}
                </Col>
              </Row>

              <Row style={styles.cardContentBoxAccountHeader}>
                Amount Earned
              </Row>
              <Row style={styles.cardContentBoxAccountContent}>
                <Col
                  span={24}
                  style={{textAlign:"end"}}
                >
                  { <NumberFormat
                    value={myVaultBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    style={{fontWeight:"600"}}
                  /> }
                </Col>
              </Row>

              <Row>
                <Col span={24} >
                  Pending Withdrawal
                </Col>
              </Row>
              <Row>
                <Col
                  span={24}
                  style={{textAlign:"end"}}
                >
                  { <NumberFormat
                    value={myVaultBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    style={{fontWeight:"600"}}
                  /> }
                </Col>
              </Row>

            </Card>


            <Collapse defaultActiveKey="0" onChange={callback}>
              <Panel header="Make A Deposit" key="1">
                <Col md={24} sm={24} xs={24}>

                  <DepositPage1
                    chainId={props.chainId}
                    currentAddress={props.currentAddress}
                  />

                </Col>
              </Panel>

              <Panel header="Make A Withdrawal" key="2">
                <Col md={24} sm={24} xs={24}>

                  <WithdrawPage1
                    chainId={props.chainId}
                    currentAddress={props.currentAddress}
                  />

                </Col>
              </Panel>

              <Panel
                header="All Deposits"
                key="3"
                extra={panelDepositCount()}
              >

                <Col md={24} sm={24} xs={24}>

                  <Table
                    dataSource={vault_deposit_table_rows}
                    columns={vault_columns}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0, textAlign:"right", fontSize:"11px" }}>{record.description}</p>
                      ),
                      rowExpandable: (record) => record.level !== "3",
                      onExpand: (expanded, record) =>
                        console.log("onExpand: ", record, expanded),
                    }}
                    />

                </Col>
              </Panel>

              <Panel
                header="All Withdrawals"
                key="4"
                extra={panelWithdrawalCount()}
              >
                <Col md={24} sm={24} xs={24}>

                  <Table
                    dataSource={vault_withdrawal_table_rows}
                    columns={vault_columns}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0, textAlign:"right", fontSize:"11px" }}>{record.description}</p>
                      ),
                      rowExpandable: (record) => record.level !== "3",
                      onExpand: (expanded, record) =>
                        console.log("onExpand: ", record, expanded),
                    }}
                  />

                </Col>
              </Panel>
            </Collapse>

          </Col>
        </Row>

      </Col>
    </Row>

);
};

export default DashboardContent;



