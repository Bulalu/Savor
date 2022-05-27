import React, { useEffect, useState } from "react";
import Banner from "./BannerImage";
import { Col, Row, Button} from "antd";
//import Text from "antd/lib/typography/Text";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Logo } from "../../App";
import Web3 from "web3";
import VaultAbi from "../Savor/ContractABIs/VaultAbi";
import moment from "moment";
import { useMoralisQuery } from "react-moralis";
import NumberFormat from "react-number-format";

const styles = {
  header: {
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};

const LandingPage = () => {

  const [ vaultAPY, setVaultAPY ] = useState(0);
  const [ vaultVirtualPrice, setVaultVirtualPrice ] = useState(null);
  const [ vaultLastVirtualPrice, setVaultLastVirtualPrice ] = useState(null);

  /*
    get the Vault APY
   */
  async function getVaultDetails(){
    const NODE_URL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/avalanche/mainnet";
    const provider = new Web3.providers.HttpProvider(NODE_URL);
    const web3 = new Web3(provider);
    const web3Provider = new web3.eth.Contract(VaultAbi(), "0x886b2a3dc127c1122c005669f726d5d37a135411");

    //now get the
    await web3Provider.methods.virtualPrice().call((err, result) => {
      console.log("vault virtualPrice : "+result);
      setVaultVirtualPrice((result / 1000000000000000000));
    });


  }
  getVaultDetails();


  const { data } = useMoralisQuery(
    "VaultVPUpdates",
    query => query
      .descending("block_timestamp")
      .limit(2),
    [],
    {
      live: true,
      autoFetch: true
    },
  );
  useEffect(() => {
    console.log("VirtualPrice results from Moralis : "+JSON.stringify(data, null, '\t'));
    if (data.length > 0) {

      /*
        if there is only 1 entry then just set value to 1
       */
      if (data.length > 1){
        setVaultLastVirtualPrice(JSON.parse(JSON.stringify(data[1])));
      } else {
        const item = JSON.parse(JSON.stringify(data[0]));
        item.createdAt = "2022-05-20T12:31:18.352Z";
        item.newVirtualPrice = 1000000000000000000;
        setVaultLastVirtualPrice(item);
      }
    }
  }, [data]);

  useEffect(()=>{
    calculateAPY();
  }, [vaultVirtualPrice, vaultLastVirtualPrice]);


  function calculateAPY(){
    console.log("calculateAPY : ");

    console.log("calculateAPY vaultVirtualPrice: "+vaultVirtualPrice+" vaultLastVirtualPrice: "+JSON.stringify(vaultLastVirtualPrice, null, '\t'));

    if ((vaultVirtualPrice !== null && vaultVirtualPrice !== undefined)
      && (vaultLastVirtualPrice !== null && vaultLastVirtualPrice !== undefined)){

      console.log("vaultVirtualPrice : "+vaultVirtualPrice+" -> vaultLastVirtualPrice: "+vaultLastVirtualPrice.newVirtualPrice/1000000000000000000);
      const vpChange = parseFloat(vaultVirtualPrice) - parseFloat(vaultLastVirtualPrice.newVirtualPrice/1000000000000000000);
      console.log("vpChange : "+vpChange);

      const nowTimestamp = moment();
      const blockTimestamp = moment(vaultLastVirtualPrice.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

      console.log("nowTimestamp : "+nowTimestamp+" -> blockTimestamp: "+blockTimestamp);

      const daysSince =  parseInt(nowTimestamp.diff(blockTimestamp, 'day', true));
      console.log("daysSince -> "+daysSince);

      const daysDivider = (365 / daysSince);
      console.log("daysDivider -> (365 / daysSince): "+daysDivider);

      const newAPY = vpChange * daysDivider * 100;
      console.log("newAPY -> vpChange * daysDivider * 100: "+newAPY);

      setVaultAPY(newAPY);

      console.log("today date : " + nowTimestamp.format('YYYY-MM-DDTHH:mm'));
      console.log("last virtual price date : " + blockTimestamp.format('YYYY-MM-DDTHH:mm'));

    }

  }








  return (
    <div>
      <Row>
        <header style={styles.header}>
          <Link to="/home">
            <Logo />
          </Link>

          <div style={styles.headerRight}>
            <Link to="/Savor1/Dashboard">
              <Button style={{ margin: "10px" }} type="primary" size="large" shape="round">Start now</Button>
            </Link>
          </div>
        </header>

        <Col md={12} sm={24} >
          <h1
            style={{
              display: "block",
              paddingTop:"100px",
              fontSize: "4em",
              paddingLeft: "1em",
              paddingRight: "1em",
              fontWeight: 700
            }}>
            <span>Balance your finances with </span>
            <span
              style={{
                textDecoration: "underline",
                textDecorationColor: "#1890ff"
              }}
            >
              {
                <NumberFormat
                  value={ vaultAPY }
                  displayType={'text'}
                  decimalScale={3}
                  suffix={"%"}
                />
              }
            </span>
            <span> APY</span>
          </h1>

          <div
            style={{
              display: "block",
              paddingTop:"50px",
              fontSize: "36px",
              paddingLeft: "1.5em",
              paddingRight: "1.5em",
              fontWeight: 500
            }}
          >
            Savor is the first of its kind Cross chain yield aggregator.
          </div>
          <p
            style={{
              display: "block",
              paddingTop:"10px",
              fontSize: "16px",
              paddingLeft: "3.5em",
              paddingRight: "3.5em",
              fontWeight: 400
            }}
          >
            Simply deposit USDC on your preferred chain and immediately start to earn the
            highest yields available across all supported chains.
          </p>
          <p
            style={{
              display: "block",
              paddingTop:"10px",
              fontSize: "16px",
              paddingLeft: "3.5em",
              paddingRight: "3.5em",
              fontWeight: 400
            }}
          >
            Savor abstracts away the
            complexities and the costs of the multi chain world and allows everyone to get
            the most out of their money with one easy and cheap deposit.
          </p>


          <Link to="/Savor1/Dashboard">
            <Button style={{marginBottom:"2em",marginLeft: "3.5em", marginRight: "1em", marginTop: "1em" }} type="primary" size="large" shape="round" icon={<PlusCircleOutlined />}>Go to the App</Button>
          </Link>
        </Col>

        <Col md={12} sm={24} style={{width: "100%"}}>
          <Banner />
        </Col>
      </Row>


      <Row style={{ backgroundColor: "#1890ff"}}>
        <Col md={24} sm={24} style={{ width: "100%", textAlign: "center"}}>
          <h2
            style={{ textTransform:"uppercase", marginTop:"11em", color: "white", fontSize: "1em", display: "flex", justifyContent: "center"}}
          >
            Distributed Yield
          </h2>
          <CountUp
            style={{ padding:"0 1em 3em 1em", color: "white", fontSize: "3em", display: "flex", justifyContent: "center"}}
            start={40020}
            end={11160527.012}
            duration={22.75}
            separator=","
            decimals={0}
            decimal=","
            prefix="$ " />
        </Col>
      </Row>
      <Row style={{overflow:"hidden"}}>
        <Col md={8} sm={24} style={{margin:"7em 0", display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center"}}  >
          <img width="82px" src="https://zos.alipayobjects.com/rmsportal/WBnVOjtIlGWbzyQivuyq.png" alt="img" />
          <h2>Instant payout</h2>
          <p style={{padding:"0 3em", textAlign:"center"}}>Start earning immediately after you deposit. Follow up with real-time data.</p>
        </Col>
        <Col md={8} sm={24} style={{margin:"7em 0", display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center"}}>
          <img width="82px" src="https://zos.alipayobjects.com/rmsportal/YPMsLQuCEXtuEkmXTTdk.png" alt="img" />
          <h2>Custom dashboard</h2>
          <p style={{padding:"0 3em", textAlign:"center"}}>Your investment data at the point of your fingertips. Anytime. Anywhere.</p>
        </Col>
        <Col md={8} sm={24} style={{margin:"7em 0", display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center"}}>
          <img width="82px" src="https://zos.alipayobjects.com/rmsportal/EkXWVvAaFJKCzhMmQYiX.png" alt="img" />
          <h2>Compound interest</h2>
          <p style={{padding:"0 3em", textAlign:"center"}}>You only win. Automatic compound makes you earn on your earnings.</p>
        </Col>
      </Row>
    </div>
  );
};

export default LandingPage;
