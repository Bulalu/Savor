
import React, { useEffect, useState } from "react";

import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralisWeb3Api } from "react-moralis";
import Moralis from "moralis";

import { Col, Row, Card, Table, Collapse, Space, Badge, Alert } from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";

import GetUserAllowance from "./Contracts/USDC";
import { getEllipsisTxt } from "../../helpers/formatters";
import ChainNetworks from "./Wallet/Networks";
import Vault1 from "./Contracts/Vault1";
import DepositPage1 from "./DepositPage1";
import WithdrawPage1 from "./WithdrawPage1";
import USDCAbi from "./ContractABIs/USDCAbi";



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
    border: "1px solid #b7eb8f",
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
  const [ myUSDCBalance, setMyUSDCBalance ] = useState(0);
  const [ myAllowance, setMyAllowance ] = useState(0);
  const [ myVaultTotalUserBalance, setMyVaultTotalUserBalance ] = useState(0);
  const [ amountEarned, setAmountEarned ] = useState(0);

  const [ withdrawalAmount, setWithdrawalAmount ] = useState(0);

  const [ myTransactions, setMyTransactions ] = useState([]);



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

    /*
        get the user balance on both networks (Avalanche/Polygon) or (Rinkeby/Mumbai)
     */
    if (props.chainId === "0xa86a" || props.chainId === "0x89") {
      //the Avalanche/Polygon networks

      const total_user_avalanche_balance_options = {
        chain: "0xa86a",
        address: contractAddress,
        function_name: "totalUserBalance",
        abi: VaultAbi(),
        params: {
          "owner": props.currentAddress
        },
      };
      const total_user_balance_avalanche = await Moralis.Web3API.native.runContractFunction(total_user_avalanche_balance_options);
      console.log("-------------- total_user_balance : "+total_user_balance_avalanche);
      console.log("My total user Balance (Avalanche) : "+total_user_balance_avalanche/1000000);


      const total_user_polygon_balance_options = {
        chain: "0x89",
        address: contractAddress,
        function_name: "totalUserBalance",
        abi: VaultAbi(),
        params: {
          "owner": props.currentAddress
        },
      };
      const total_user_balance_polygon = await Moralis.Web3API.native.runContractFunction(total_user_polygon_balance_options);
      console.log("-------------- total_user_balance : "+total_user_balance_polygon);
      console.log("My total user Balance (Polygon) : "+total_user_balance_polygon/1000000);

      const vaultTotals = parseFloat(total_user_balance_avalanche/1000000) + parseFloat(total_user_balance_polygon/1000000);
      setMyVaultTotalUserBalance(vaultTotals);
      setWithdrawalAmount(vaultTotals);

    } else if (props.chainId === "0x4" || props.chainId === "0x13881") {
      //the Rinkeby/Mumbai networks

      const total_user_rinkeby_balance_options = {
        chain: "0x4",
        address: contractAddress,
        function_name: "totalUserBalance",
        abi: VaultAbi(),
        params: {
          "owner": props.currentAddress
        },
      };
      const total_user_balance_rinkeby = await Moralis.Web3API.native.runContractFunction(total_user_rinkeby_balance_options);
      console.log("-------------- total_user_balance : "+total_user_balance_rinkeby);
      console.log("My total user Balance (Rinkeby) : "+total_user_balance_rinkeby/1000000);


      const total_user_mumbai_balance_options = {
        chain: "0x13881",
        address: contractAddress,
        function_name: "totalUserBalance",
        abi: VaultAbi(),
        params: {
          "owner": props.currentAddress
        },
      };
      const total_user_balance_mumbai = await Moralis.Web3API.native.runContractFunction(total_user_mumbai_balance_options);
      console.log("-------------- total_user_balance : "+total_user_balance_mumbai);
      console.log("My total user Balance (Mumbai) : "+total_user_balance_mumbai/1000000);

      const vaultTotals = parseFloat(total_user_balance_rinkeby/1000000) + parseFloat(total_user_balance_mumbai/1000000);
      setMyVaultTotalUserBalance(vaultTotals);
      setWithdrawalAmount(vaultTotals);

    }

    console.log("Get the Allowance");
    setMyAllowance(await GetUserAllowance(props.chainId, props.currentAddress));


    /*
      get the USDC balance for the current network
   */
    const USDCAddressRinkebyTestnet ="0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4";
    const USDCAddressPolygonTestnet ="0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7";

    const USDCAddressPolygonMainnet = "0xDD9185DB084f5C4fFf3b4f70E7bA62123b812226";
    const USDCAddressAvalancheMainnet = "0xa3fa3D254bf6aF295b5B22cC6730b04144314890";

    let addressToUse="";
    switch (props.chainId){
      case "0x4":
        addressToUse = USDCAddressRinkebyTestnet;
        break;
      case "0x13881":
        addressToUse = USDCAddressPolygonTestnet;
        break;
      case "0x89":
        addressToUse = USDCAddressPolygonMainnet;
        break;
      case "0xa86a":
        addressToUse = USDCAddressAvalancheMainnet;
        break;
      default:

    }

    console.log("addressToUse : "+addressToUse);

    const usdc_balance_options = {
      chain: props.chainId,
      address: addressToUse,
      function_name: "balanceOf",
      abi: USDCAbi(),
      params: {
        "account": props.currentAddress
      },
    };
    const total_usdc_balance = await Moralis.Web3API.native.runContractFunction(usdc_balance_options);
    console.log("-------------- total_usdc_balance : "+total_usdc_balance);
    console.log("My total_usdc_balance : "+total_usdc_balance/1000000);
    setMyUSDCBalance(total_usdc_balance/1000000);




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
              myVaultTotalUserBalance={myVaultTotalUserBalance}
              setVaultAssetsBreakdown={setVaultAssetsBreakdown}
            />

            <Alert
              message="USDC"
              description="Deposit only USDC on the Avalanche or Polygon blockchains."
              type="success"
              showIcon
              closable
              style={{marginBottom:"10px", fontSize:"11px"}}
            />
            <Alert
              message="Warning"
              description="This is experimental software. You can lose part or all of your funds. Please proceed with caution. "
              type="warning"
              showIcon
              closable
              style={{marginBottom:"40px", fontSize:"11px"}}
            />




          </Col>

          <Col md={8} sm={24} xs={24}>

            <Card style={styles.cardContentBoxAccount}>
              <Row style={styles.cardContentBoxAccountHeader}>
                <Col span={12}>
                  My Balance
                </Col>

                <Col span={12} style={{textAlign:"end"}}>
                  {<NumberFormat
                    value={myVaultTotalUserBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    style={{fontWeight:"600"}}
                  />}
                </Col>
              </Row>

              <Row style={styles.cardContentBoxAccountHeader}>

                <Col span={12}>
                  Amount Earned
                </Col>
                <Col span={12} style={{textAlign:"end"}} >
                  { <NumberFormat
                    value={0}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    style={{fontWeight:"600"}}
                  /> }
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  Pending Withdrawal
                </Col>
                <Col
                  span={12}
                  style={{textAlign:"end"}}
                >
                  { <NumberFormat
                    value={"0"}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    style={{fontWeight:"600"}}
                  /> }
                </Col>
              </Row>

            </Card>


            <Collapse defaultActiveKey="1" onChange={callback}>
              <Panel header="Make A Deposit" key="1">
                <Col md={24} sm={24} xs={24}>

                  <DepositPage1
                    chainId={props.chainId}
                    currentAddress={props.currentAddress}
                    myUSDCBalance={myUSDCBalance}
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



