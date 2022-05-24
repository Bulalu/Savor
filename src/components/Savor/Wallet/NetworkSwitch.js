import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Networks from "./Networks";
import detectEthereumProvider from "@metamask/detect-provider";


const styles = {
  item: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
    padding: "0 10px",
  },
  button: {
    border: "2px solid rgb(231, 234, 243)",
    borderRadius: "12px",
  },
};


function NetworkSwitch(props) {

  console.log("!!! NetworkSwitch : " + JSON.stringify(props));

  const [provider, setProvider] = useState({});
  const [selected, setSelected] = useState({});

  useEffect(async() => {
    console.log("!!! the chain has changed : " + props.chainId);

    if (!props.chainId) return null;
    setProvider(await getProvider());

    const newSelected = Networks().find((item) => item.key === props.chainId);

    console.log("!!! newSelected : " + newSelected);
    setSelected(newSelected);
    console.log("current chainId: ", props.chainId);
  }, [props.chainId]);


  const getProvider = async() => {

    let provider = await detectEthereumProvider();
    console.log("----- the PROVIDER IS "+provider);

    // edge case if MM and CoinbaseWallet are both installed
    try {
      if (window.ethereum.providers?.length) {
        window.ethereum.providers.forEach(async (p) => {
          if (p.isMetaMask) {
            console.log("setting provider to MM");
            provider = p;
          }
        });

      }
    } catch (e){
      console.log(JSON.stringify(e, null, '\t'));
    }

    return provider;
  }

  const handleMenuClick = async(e) => {
    console.log("switch to: ", e.key);

    try {

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e.key }],
      });

      //will continue from the 'chainChanged' event in WalletChain


    } catch (switchError) {

      console.log("switchError : "+JSON.stringify(switchError, null, '\t'));

      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        alert("This network needs to be added to your wallet first");

        promptToAddNetworkToWallet(e.key);

      } else if (switchError.code === -32002){
        //there are unfinished actions on the wallet
        console.log("need to open the wallet to finish previous tasks first ...");

      }

      // handle other "switch" errors


    }



  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {Networks().map((item) => (
        <Menu.Item key={item.key} icon={item.icon} style={styles.item}>
          <span style={{ marginLeft: "5px" }}>{item.value}</span>
        </Menu.Item>
      ))}
    </Menu>
  );


  async function promptToAddNetworkToWallet(chainId) {
    console.log("promptToAddNetworkToWallet");

    const networkDetails = {};
    if (chainId === "0xa86a") {
      networkDetails.chainId = "0xa86a";
      networkDetails.chainName = "Avalanche";
      networkDetails.rpcUrls = ["https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/avalanche/mainnet"];
      networkDetails.nativeCurrency = {
        "symbol": "AVAX",
        "decimals": 18,
      };
    } else if (chainId === "0x89") {
      networkDetails.chainId = "0x89";
      networkDetails.chainName = "Polygon";
      networkDetails.rpcUrls = ["https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/polygon/mainnet"];
      networkDetails.nativeCurrency = {
        "symbol": "MATIC",
        "decimals": 18,
      };
    } else if (chainId === "0x4") {
      networkDetails.chainId = "0x4";
      networkDetails.chainName = "Rinkeby";
      networkDetails.rpcUrls = ["https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/eth/rinkeby"];
      networkDetails.nativeCurrency = {
        "symbol": "ETH",
        "decimals": 18,
      };
    } else if (chainId === "0x13881") {
      networkDetails.chainId = "0x13881";
      networkDetails.chainName = "Mumbai";
      networkDetails.rpcUrls = ["https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/polygon/mumbai"];
      networkDetails.nativeCurrency = {
        "symbol": "MATIC",
        "decimals": 18,
      };
    }

    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [networkDetails],
      });
    } catch (addError) {
      // handle "add" error
      console.log("addError : " + JSON.stringify(addError));
    }
  }


  if (props.chainId === "" || (props.chainId !== "0xa86a" && props.chainId !== "0x89" && props.chainId !== "0x4" && props.chainId !== "0x13881")){
    //nothing to show
    return <></>
  } else {
    return (
      <div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            key={selected?.key}
            icon={selected?.icon}
            style={{ ...styles.button, ...styles.item }}
          >
            <span style={{ marginLeft: "5px" }}>{selected?.value}</span>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    );
  }

}



export default NetworkSwitch;
