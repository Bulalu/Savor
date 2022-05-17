import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import NumberFormat from "react-number-format";
import Web3 from "web3";
import VaultAbi from "../ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Moment from "react-moment";
import Moralis from "moralis";

const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
  },
};


function Vault(props) {

  console.log("props : "+JSON.stringify(props));

//  const { chainId } = useMoralis();

  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");
  const [ vaultName, setVaultName ] = useState("");
  const [ vaultSupply, setVaultSupply ] = useState(0);
  const [ vaultAssets, setVaultAssets ] = useState(0);
  const [ vaultAPY, setVaultAPY ] = useState(5.87);
  const [ lastHarvest, setLastHarvest ] = useState(0);
  const [ vaultHoldings, setVaultHoldings ] = useState(0);
  const [ vaultTransactions, setVaultTransactions ] = useState([]);

  /*
    if the contract address changes
   */

  useEffect(()=>{
    console.log("!!!!!!!!!!!!!getting contract info ...");

    console.log("!!!!!!!!!!!!!contractAddress ..."+contractAddress);
    console.log("!!!!!!!!!!!!!props.chainId ..."+props.chainId);
    console.log("!!!!!!!!!!!!!props.myVaultBalance ..."+props.myVaultBalance);

    //update everything about the Vault

    if (props.chainId !== "" && contractAddress !== "") {
      getVaultName();
      getVaultSupply();
      getVaultAssets();
      getLastHarvest();
    }

  }, [contractAddress, props.chainId, props.myVaultBalance]);




  const VaultContract = () => {


    if (props.chainId === "0x4"){
      //use infura for this
      const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
      const web3 = new Web3(rpcURL);
      return new web3.eth.Contract(VaultAbi(), contractAddress);

    }
    if (props.chainId === "0x13881"){
      //use Moralis speedy nodes
      const NODE_URL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/polygon/mumbai";
      const provider = new Web3.providers.HttpProvider(NODE_URL);
      const web3 = new Web3(provider);
      return new web3.eth.Contract(VaultAbi(), contractAddress);
    }
  }

  const getVaultName = async() => {
/*
    const options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "name",
      abi: VaultAbi(),
    };
    setVaultName(await Moralis.Web3API.native.runContractFunction(options));
*/

    VaultContract().methods.name().call((err, result) => {
      console.log("Vault Name : "+result);
      setVaultName(result);
    });


  }


  const getVaultSupply = async() => {

/*
    const options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "totalSupply",
      abi: VaultAbi(),
    };
    setVaultSupply(await Moralis.Web3API.native.runContractFunction(options));
*/

    VaultContract().methods.totalSupply().call((err, result) => {
      console.log("vault supply : "+result);
      setVaultSupply(result);
    });

  }

  const getVaultAssets = async() => {

/*
    const options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "totalAssets",
      abi: VaultAbi(),
    };
    setVaultAssets(await Moralis.Web3API.native.runContractFunction(options));
*/

    VaultContract().methods.totalAssets().call((err, result) => {
      console.log("vault assets : "+result);
      setVaultAssets(result);
    });
  }

  const getLastHarvest = async() => {
    const options = {
      chain: props.chainId,
      address: contractAddress,
      function_name: "lastHarvest",
      abi: VaultAbi(),
    };
    setLastHarvest(await Moralis.Web3API.native.runContractFunction(options));

  }


  return(

    <Card style={styles.card} title={vaultName} bodyStyle={{ padding: "18px", fontSize:"12px" }}>
      <Row>
        <Col span={12}>Supply : </Col>
        <Col span={12} style={{textAlign:"end"}}>${ <NumberFormat value={(vaultSupply/1000000)} displayType={'text'} thousandSeparator={true} /> }</Col>
      </Row>

      <Row>
        <Col span={12}>Assets : </Col>
        <Col span={12} style={{textAlign:"end"}}>${ <NumberFormat value={(vaultAssets/1000000)} displayType={'text'} thousandSeparator={true} /> }</Col>
      </Row>

      <Row>
        <Col span={24}>Last Harvest : </Col>
        <Col span={24} style={{textAlign:"end"}}>{ lastHarvest==="0"?'N/A':<Moment format="dddd, MMM Do h:mm A">{lastHarvest*1000}</Moment> }</Col>
      </Row>

      <Row>
        <Col span={12}>APY : </Col>
        <Col span={12} style={{textAlign:"end"}}>{ vaultAPY }%</Col>
      </Row>

    </Card>



  )


}

export default Vault;





function VaultDepositEvents(props) {

  const { chainId } = useMoralis();
  const Web3Api = useMoralisWeb3Api();

  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");
  const [ deposits, setDeposits ] = useState([]);

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


  useEffect(() => {
    fetchContractEvents();
  }, [chainId, contractAddress]);


  const fetchContractEvents = async () => {

    console.log("getting contract events ...");

    const options = {
      chain: chainId,
      address: contractAddress,
      topic: "Deposit(address, address, uint256, uint256)",
      limit: "100",
      abi: ABI,
    };
    const events = await Web3Api.native.getContractEvents(options);
    console.log("vault events : "+JSON.stringify(events));
    setDeposits(events);
  };
  fetchContractEvents();


  return <div>{deposits}</div>;
}

export { VaultDepositEvents };
