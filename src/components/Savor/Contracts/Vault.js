import React, { useEffect, useState } from "react";
import { Card } from "antd";
import NumberFormat from "react-number-format";
import Web3 from "web3";
import VaultAbi from "../ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

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

  const { chainId } = useMoralis();

  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");
  const [ vaultName, setVaultName ] = useState("");
  const [ vaultSupply, setVaultSupply ] = useState(0);
  const [ vaultAssets, setVaultAssets ] = useState(0);
  const [ vaultAPY, setVaultAPY ] = useState(5.87);
  const [ lastHarvest, setLastHarvest ] = useState(0);
  const [ vaultTransactions, setVaultTransactions ] = useState([]);

  /*
    if the contract address changes
   */

  useEffect(()=>{
    console.log("!!!!!!!!!!!!!getting contract info ...");
    //update everything about the Vault
    getVaultName();
    getVaultSupply();
    getVaultAssets();
    getLastHarvest();

  }, [contractAddress, chainId, props.myVaultBalance]);


  const VaultContract = () => {

    const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
    const web3 = new Web3(rpcURL);
    return new web3.eth.Contract(VaultAbi(), contractAddress);
  }

  const getVaultName = () => {
    VaultContract().methods.name().call((err, result) => {
      console.log("Vault Name : "+result);
      setVaultName(result);
    });
  }

  const getVaultSupply = () => {
    VaultContract().methods.totalSupply().call((err, result) => {
      console.log("vault supply : "+result);
      setVaultSupply(result);
    });
  }

  const getVaultAssets = () => {
    VaultContract().methods.totalAssets().call((err, result) => {
      console.log("vault assets : "+result);
      setVaultAssets(result);
    });
  }

  const getLastHarvest = () => {
    VaultContract().methods.lastHarvest().call((err, result) => {
      console.log("last harvest : "+result);
      setLastHarvest(result);
    });
  }


  return(

    <Card style={styles.card} title={vaultName} bodyStyle={{ padding: "18px" }}>
      <p>Supply : ${ <NumberFormat value={(vaultSupply/1000000)} displayType={'text'} thousandSeparator={true} /> }</p>
      <p>Assets : ${ <NumberFormat value={(vaultAssets/1000000)} displayType={'text'} thousandSeparator={true} /> }</p>
      <p>Last Harvest : { lastHarvest }</p>
      <p>APY : { vaultAPY }%</p>
    </Card>



  )


}

export default Vault;





function VaultEvents(props) {

  const { chainId } = useMoralis();
  const Web3Api = useMoralisWeb3Api();

  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");


  const ABI = {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  };


  useEffect(() => {
    fetchContractEvents();
  }, [chainId, contractAddress]);


  const fetchContractEvents = async () => {

    console.log("getting contract events ...");

    const options = {
      chain: chainId,
      address: contractAddress,
      topic: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      limit: "3",
      abi: ABI,
    };
    const events = await Web3Api.native.getContractEvents(options);
    console.log(events);
  };

  return (
    <h1 style={{ marginTop:"2em", marginBottom:"1em", fontSize:"1.5em"}}>My transactions</h1>
  )
}

export { VaultEvents };
