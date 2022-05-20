import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import NumberFormat from "react-number-format";
import Web3 from "web3";
import VaultAbi from "../ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Moment from "react-moment";
import ChainNetworks from "../Wallet/Networks";


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


  const [ contractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");
  const [ vaultName, setVaultName ] = useState("");
  const [ vaultPrimaryName, setVaultPrimaryName ] = useState("");
  const [ vaultSecondaryName, setVaultSecondaryName ] = useState("");

  const [ vaultSupplyPrimary, setVaultSupplyPrimary ] = useState(0);
  const [ vaultSupplySecondary, setVaultSupplySecondary ] = useState(0);
  const [ vaultSupplyTotal, setVaultSupplyTotal ] = useState(0);

  const [ vaultAssetsPrimary, setVaultAssetsPrimary ] = useState(0);
  const [ vaultAssetsSecondary, setVaultAssetsSecondary ] = useState(0);
  const [ vaultAssetsTotal, setVaultAssetsTotal ] = useState(0);

  const [ vaultAPY, setVaultAPY ] = useState(5.87);
  const [ lastHarvest, setLastHarvest ] = useState(0);
  const [ vaultVirtualPrice, setVaultVirtualPrice ] = useState(0);
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

    //if on mainnet then you need providers for both Avalanche and Polygon
    //if on testnet then you need providers for both Rinkeby and Mumbai (Polygon)


    if (props.chainId !== ""){

      let vc1 = null;
      let vc2 = null;
      if (props.chainId === "0xa86a"){
        vc1=props.chainId;
        vc2="0x89";
        setVaultPrimaryName("Avalanche");
        setVaultSecondaryName("Polygon");
      }
      if (props.chainId === "0x89"){
        vc1=props.chainId;
        vc2="0xa86a";
        setVaultPrimaryName("Polygon");
        setVaultSecondaryName("Avalanche");
      }
      if (props.chainId === "0x4"){
        vc1=props.chainId;
        vc2="0x13881";
        setVaultPrimaryName("Rinkeby");
        setVaultSecondaryName("Mumbai");
      }
      if (props.chainId === "0x13881"){
        vc1=props.chainId;
        vc2="0x4";
        setVaultPrimaryName("Mumbai");
        setVaultSecondaryName("Rinkeby");
      }

      const vcProvider1 = VaultContract(vc1);
      const vcProvider2 = VaultContract(vc2);

      if (vcProvider1 !== null) {
        getVaultName(vcProvider1);
        getVaultSupply(vcProvider1, vcProvider2);
        getVaultAssets(vcProvider1, vcProvider2);
        getLastHarvest(vcProvider1);
        getVirtualPrice(vcProvider1);

      } else {

        setVaultName("No Savor Vault on "+ChainNetworks()
          .filter((network)=> network.key === props.chainId)
          .map((network)=> network.value)+" network");
        setVaultPrimaryName("");
        setVaultSecondaryName("");

        setVaultSupplyPrimary(0);
        setVaultSupplySecondary(0);
        setVaultSupplyTotal(0);

        setVaultAssetsPrimary(0);
        setVaultAssetsSecondary(0);
        setVaultAssetsTotal(0);

        setLastHarvest(0);
        setVaultAPY(0);
        setVaultVirtualPrice(0);

      }

    } else {
      //no chainID
      setVaultName("No Savor Vault");
      setVaultPrimaryName("");
      setVaultSecondaryName("");

      setVaultSupplyPrimary(0);
      setVaultSupplySecondary(0);
      setVaultSupplyTotal(0);

      setVaultAssetsPrimary(0);
      setVaultAssetsSecondary(0);
      setVaultAssetsTotal(0);

      setLastHarvest(0);
      setVaultAPY(0);
      setVaultVirtualPrice(0);

    }

  }, [contractAddress, props.chainId, props.myVaultBalance]);




  const VaultContract = (netWorkChainId) => {
    console.log("props.chainId : "+netWorkChainId);

    if (netWorkChainId !== "") {

      if (netWorkChainId === "0x4") {
        //for the Polygon testnet - use infura for this

        const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
        const web3 = new Web3(rpcURL);
        return new web3.eth.Contract(VaultAbi(), contractAddress);

      } else if (netWorkChainId === "0x13881") {
        //for the polygon testnet - use Moralis speedy nodes

        const NODE_URL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/polygon/mumbai";
        const provider = new Web3.providers.HttpProvider(NODE_URL);
        const web3 = new Web3(provider);
        return new web3.eth.Contract(VaultAbi(), contractAddress);

      } else if (netWorkChainId === "0xa86a") {
        //for the Avalanche Mainnet - use Moralis speedy nodes
        const NODE_URL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/avalanche/mainnet";
        const provider = new Web3.providers.HttpProvider(NODE_URL);
        const web3 = new Web3(provider);
        return new web3.eth.Contract(VaultAbi(), contractAddress);

      } else if (netWorkChainId === "0x89") {
        //for the Polygon mainnet - use Moralis speedy nodes
        const NODE_URL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/polygon/mainnet";
        const provider = new Web3.providers.HttpProvider(NODE_URL);
        const web3 = new Web3(provider);
        return new web3.eth.Contract(VaultAbi(), contractAddress);

      } else {
        return null;
      }
    } else {
      return null;
    }

  }

  const getVaultName = async(vc) => {
    await vc.methods.name().call((err, result) => {
      console.log("Vault Name : "+result);
      setVaultName(result);
    });
  }


  const getVaultSupply = async(vc1, vc2) => {
    await vc1.methods.thisVaultsSupply().call((err, supply1) => {
      console.log("vault1 supply : "+supply1);
      setVaultSupplyPrimary(supply1);

      vc2.methods.thisVaultsSupply().call((err, supply2) => {
        console.log("vault2 supply : " + supply2);
        setVaultSupplySecondary(supply2);

        console.log("adding supply: " + add(supply1,supply2));
        setVaultSupplyTotal(add(supply1,supply2));
      });

    });
  }

  const getVaultAssets = async(vc1, vc2) => {
    await vc1.methods.thisVaultsHoldings().call((err, assets1) => {
      console.log("assets1 assets : "+assets1);
      setVaultAssetsPrimary(assets1);

      vc2.methods.thisVaultsHoldings().call((err, assets2) => {
        console.log("assets2 assets : " + assets2);
        setVaultAssetsSecondary(assets2);

        console.log("adding assets: " + add(assets1, assets2));
        setVaultAssetsTotal(add(assets1, assets2));
      });

    });
  }



  const getLastHarvest = async(vc) => {
    await vc.methods.lastHarvest().call((err, result) => {
      console.log("vault lastHarvest : "+result);
      setLastHarvest(result);
    });
  }

  const getVirtualPrice = async(vc) => {
    await vc.methods.virtualPrice().call((err, result) => {
      console.log("vault virtualPrice : "+result);
      setVaultVirtualPrice((result / 1000000000000000000));
    });
  }


  return(

    <Card style={styles.card} title={vaultName} bodyStyle={{ padding: "18px", fontSize:"12px" }}>

      <Row>
        <Col span={12}>Supply : </Col>
        <Col span={12} style={{textAlign:"end"}}>
          {vaultPrimaryName}
          ${ <NumberFormat value={(vaultSupplyPrimary/1000000)} displayType={'text'} thousandSeparator={true} /> }
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{textAlign:"end"}}>
          {vaultSecondaryName}
          ${ <NumberFormat value={(vaultSupplySecondary/1000000)} displayType={'text'} thousandSeparator={true} /> }
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{textAlign:"end"}}>
          Total
          ${ <NumberFormat value={(vaultSupplyTotal/1000000)} displayType={'text'} thousandSeparator={true} /> }
        </Col>
      </Row>

      <Row>
        <Col span={12}>Assets : </Col>
        <Col span={12} style={{textAlign:"end"}}>
          {vaultPrimaryName}
          ${ <NumberFormat value={(vaultAssetsPrimary/1000000)} displayType={'text'} thousandSeparator={true} /> }
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{textAlign:"end"}}>
          {vaultSecondaryName}
          ${ <NumberFormat value={(vaultAssetsSecondary/1000000)} displayType={'text'} thousandSeparator={true} /> }
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{textAlign:"end"}}>
          Total
          ${ <NumberFormat value={(vaultAssetsTotal/1000000)} displayType={'text'} thousandSeparator={true} /> }
        </Col>
      </Row>


      <Row>
        <Col span={24}>Last Harvest : </Col>
        <Col span={24} style={{textAlign:"end"}}>{ lastHarvest==="0"?'N/A':<Moment format="dddd, MMM Do h:mm A">{lastHarvest*1000}</Moment> }</Col>
      </Row>

      <Row>
        <Col span={12}>VirtualPrice : </Col>
        <Col span={12} style={{textAlign:"end"}}> ${ vaultVirtualPrice }</Col>
      </Row>

      <Row>
        <Col span={12}>APY : </Col>
        <Col span={12} style={{textAlign:"end"}}>{ vaultAPY }%</Col>
      </Row>

    </Card>



  )


}


function add(num1, num2) {
  num1 = num1.split('');
  num2 = num2.split('');

  num1 = num1.map(function (num) {
    return parseInt(num, 10);
  });

  num2 = num2.map(function (num) {
    return parseInt(num, 10);
  });

  if (num2.length > num1.length) {
    return _add(num2, num1);
  } else {
    return _add(num1, num2)
  }
}

function _add(num1, num2) {
  var num1_idx = num1.length-1;
  var num2_idx = num2.length-1;
  var remainder = 0;

  for (; num1_idx > -1; num1_idx--, num2_idx--) {
    var sum = num1[num1_idx] + remainder;

    if (num2_idx > -1) {
      sum += num2[num2_idx];
    }

    if (sum <= 9 || num1_idx === 0) {
      remainder = 0;
      num1[num1_idx] = sum;
    } else if (sum >= 10) {
      remainder = 1;
      num1[num1_idx] = sum - 10;
    }

    console.log(remainder);
  }

  return num1.join('');
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
