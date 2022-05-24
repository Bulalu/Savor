import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import NumberFormat from "react-number-format";
import Web3 from "web3";
import { useMoralis, useMoralisQuery, useMoralisWeb3Api } from "react-moralis";
import Moment from "react-moment";
import moment from 'moment'
import ChainNetworks from "../Wallet/Networks";
import VaultAbi from "../ContractABIs/VaultAbi";
import DemoPie from "../Visuals/PieChart";



const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
  },
  cardContentBox: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    backgroundColor: "#eeeeee",
    marginRight: "10px",
    marginTop: "auto",
    marginBottom: "auto"
  },
  cardContentBoxHeader: {
    fontSize: "16px"
  },
  cardContentBoxContent: {
    fontSize: "14px",
    fontWeight: "600"
  },
  cardContentBoxContentCenter: {
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center"
  },
  cardContentBoxContentRight: {
    fontSize: "11px",
    fontWeight: "600",
    textAlign: "end"
  }
};


function Vault(props) {

  console.log("Vault props : "+JSON.stringify(props));


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
  const [ vaultAssetsBreakdown, setVaultAssetsBreakdown ] = useState([]);

  const [ vaultAPY, setVaultAPY ] = useState(0);
  const [ lastHarvest, setLastHarvest ] = useState(0);
  const [ vaultVirtualPrice, setVaultVirtualPrice ] = useState(null);
  const [ vaultLastVirtualPrice, setVaultLastVirtualPrice ] = useState(null);
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

        console.log("adding supply: " + (parseInt(supply1) + parseInt(supply2)));
        setVaultSupplyTotal((parseInt(supply1) + parseInt(supply2)));
      });

    });
  }

  const getVaultAssets = async(vc1, vc2) => {
    await vc1.methods.thisVaultsHoldings().call((err, assets1) => {
      console.log("assets1 assets : "+assets1);
      setVaultAssetsPrimary(assets1);

      vc2.methods.thisVaultsHoldings().call((err, assets2) => {
        console.log("assets2 assets : " + (typeof assets2));
        setVaultAssetsSecondary(assets2);

        console.log("-----------------------");
        console.log("parseInt(assets1) : "+parseInt(assets1));
        console.log("parseInt(assets2) : "+parseInt(assets2));

        const totalHoldings = parseInt(assets1) + parseInt(assets2);
        console.log("totalHoldings : "+totalHoldings);


        setVaultAssetsTotal(totalHoldings);


        let asset1Slice = 0;
        let asset2Slice = 0;

        if (totalHoldings > 0) {
          if (parseInt(assets1) === 0) {
            console.log("assets1 === 0");
            asset1Slice = 0;
            asset2Slice = 100;
          } else if (parseInt(assets2) === 0) {
            console.log("assets2 === 0");
            asset1Slice = 100;
            asset2Slice = 0;
          } else {
            console.log("both assets1 and assets2 are > 0");
            console.log("slice1 part : "+parseFloat((parseInt(assets1) / totalHoldings) * 100).toFixed(0));
            console.log("slice2 part : "+parseFloat((parseInt(assets2) / totalHoldings) * 100).toFixed(0));

            asset1Slice = parseInt(parseFloat((parseInt(assets1) / totalHoldings) * 100).toFixed(0));
            asset2Slice = parseInt(parseFloat((parseInt(assets2) / totalHoldings) * 100).toFixed(0));
          }

        } else {
          //nothing to show

        }

        //add the data for the dashboard pie chart
        const data = [
          {
            type: vaultPrimaryName,
            value: asset1Slice,
          },
          {
            type: vaultSecondaryName,
            value: asset2Slice,
          }
        ];

        console.log("pie data : "+JSON.stringify(data));

        setVaultAssetsBreakdown(data);
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

      //proceed to get the APY
      calculateAPY();

    });
  }


  /*
      for calculating the APY
   */

  const { data, error, isLoading } = useMoralisQuery(
    "RinkebyVaultVPUpdates",
    query => query
      .descending("block_timestamp")
      .limit(1),
    [],
    {
      live: true,
      autoFetch: true
    },
  );
  useEffect(() => {
    console.log("VirtualPrice results from Moralis : "+JSON.stringify(data, null, '\t'));
    if (data.length > 0) {
      setVaultLastVirtualPrice(JSON.parse(JSON.stringify(data[0])));
      calculateAPY();
    }
  }, [data]);

  function calculateAPY(){
    console.log("calculateAPY : ");

    if ((vaultVirtualPrice !== null && vaultVirtualPrice !== undefined)
      && (vaultLastVirtualPrice !== null && vaultLastVirtualPrice !== undefined)){

      console.log("vaultVirtualPrice : "+vaultVirtualPrice+" -> vaultLastVirtualPrice: "+vaultLastVirtualPrice.newVirtualPrice);
      const vpChange = parseInt(vaultVirtualPrice) - parseInt(vaultLastVirtualPrice.newVirtualPrice);
      const nowTimestamp = moment();
      const blockTimestamp = moment(vaultLastVirtualPrice.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

      console.log("nowTimestamp : "+nowTimestamp+" -> blockTimestamp: "+blockTimestamp);

      const daysSince =  Math.ceil(nowTimestamp.diff(blockTimestamp, 'day', true));
      console.log("daysSince : "+daysSince);

      console.log("vpChange : "+vpChange);
      const daysDivider = (365 / daysSince);

      const newAPY = vpChange / daysDivider * 100;

      setVaultAPY(newAPY / 1000000000000000000);

    }

  }


  console.log("props.myVaultBalance : "+typeof props.myVaultBalance);


  return(

    <Card
      style={styles.card}
      title={vaultName}
      bodyStyle={{ padding: "18px", fontSize:"12px" }}
      extra={
        <NumberFormat
          value={props.myVaultBalance}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'My Balance $'}
          style={{fontWeight:"600"}}
        />}
    >

      <Row>

        <Col md={24} sm={24} xs={24}>
          <Row>
            <Col md={8} sm={24} xs={24}>
              <Card style={styles.cardContentBox}>
                <Row style={styles.cardContentBoxHeader}>
                  TVL
                </Row>
                <Row style={styles.cardContentBoxContentCenter}>
                  { <NumberFormat
                    value={
                      (vaultAssetsTotal/1000000)
                    }
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={"$"}
                    />
                  }
                </Row>
              </Card>
            </Col>
            <Col md={8} sm={24} xs={24}>
              <Card style={styles.cardContentBox}>
                <Row style={styles.cardContentBoxHeader}>
                  APY
                </Row>
                <Row style={styles.cardContentBoxContentCenter}>
                  { <NumberFormat value={ vaultAPY } displayType={'text'} thousandSeparator={true} decimalScale={2} suffix={"%"}/> }
                </Row>
              </Card>
            </Col>
            <Col md={8} sm={24} xs={24}>
              <Card style={styles.cardContentBox}>
                <Row style={styles.cardContentBoxHeader}>
                  Last Harvest
                </Row>
                <Row style={styles.cardContentBoxContentRight}>
                  { lastHarvest==="0"?'N/A':<Moment format="dddd, MMM Do h:mm A">{lastHarvest*1000}</Moment> }
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>

        <Col md={16} sm={24} xs={24}>
          <DemoPie
            vaultAssetsBreakdown={vaultAssetsBreakdown}
          />
        </Col>

        <Col md={8} sm={24} xs={24} style={{marginTop:"auto",marginBottom:"auto"}}>
          <Card style={styles.cardContentBox}>
            <Row style={styles.cardContentBoxHeader}>
              Asset Allocations
            </Row>
            <Row>
              <Col span={24} >
                {vaultPrimaryName}
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{textAlign:"end"}}
              >
                ${ <NumberFormat value={(vaultAssetsPrimary/1000000)} displayType={'text'} thousandSeparator={true} /> }
              </Col>
            </Row>

            <Row>
              <Col span={24} >
                {vaultSecondaryName}
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{textAlign:"end"}}
              >
                ${ <NumberFormat value={(vaultAssetsSecondary/1000000)} displayType={'text'} thousandSeparator={true} /> }
              </Col>
            </Row>

          </Card>

        </Col>
      </Row>

      <Row>
        <Col span={24} style={{textAlign:"end"}}>
          Virtual Price: $1 USDC = ${ vaultVirtualPrice } svUSDC
        </Col>

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
