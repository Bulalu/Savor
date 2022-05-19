import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Button, Card, Col, Menu, Row } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import ChainNetworks from "./Networks";
import { ExclamationCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { getEllipsisTxt } from "../../../helpers/formatters";
import { useMoralisWeb3Api } from "react-moralis";
import Web3 from "web3";


const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer"
  },
  text: {
    color: "#21BF96",
  },
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


function WalletChain(props) {


  const [ wallet, setWallet ] = useState(false);
  const [ walletAddress, setWalletAddress ] = useState("");
  const [ chain, setChainId ] = useState("");
  const [ connected, setConnected ] = useState(false);


  //whenever the state of the wallet changes
  useEffect(()=>{
    console.log("useEffect --- "+wallet);
    props.setWalletInstalled(wallet);
    connectedDisplay();
  }, [wallet]);

  //whenever the state of the chain changes
  useEffect(()=>{
    console.log("useEffect --- "+chain);
    props.setChainId(chain);
  }, [chain]);

  //whenever the state of the wallet address changes
  useEffect(()=>{
    console.log("useEffect --- "+walletAddress);
    props.setCurrentAddress(walletAddress);
    connectedDisplay();
  }, [walletAddress]);



  useEffect(() => {
    console.log("useEffect : initialCheck");

    const initialCheck = async () => {

      console.log("Checking connection");
      console.log("ethereum : "+window.ethereum);

      if (window.ethereum === undefined){
        //nothing to do
        console.log("no wallet installed");

        setWallet(false);

      } else {
        console.log("wallet is installed : get Provider");
        //there is a wallet available

        const provider = await getProvider();

        if (provider === null){
          console.log("Provider not available");

          setWallet(false);

        } else {
          console.log("Provider is available");

          setWallet(true);

          //get the chain info
          const _chainId = await provider.request({
            method: 'eth_chainId'
          });
          console.log("----- chainId "+_chainId);    //this seems to be accurate
          setChainId(_chainId);

          provider.on('chainChanged', (changedTo)=>{
            console.log("chain Changed from "+_chainId+" to "+changedTo);
            setChainId(changedTo);
          });

          provider.on('accountsChanged', (accounts) => {
            // Handle the new accounts, or lack thereof.
            // "accounts" will always be an array, but it can be empty.
            console.log("account Changed from "+wallet+" to "+accounts);
            console.log("accounts length : "+accounts.length);
            if (accounts.length === 0){
              setWalletAddress("");
            } else if (accounts.length === 1){
              setWalletAddress(accounts[0]);
              //get the balance
              const web3 = new Web3(window.ethereum);
              web3.eth.getAccounts().then((accounts)=>{
                console.log("the accounts : "+JSON.stringify(accounts.length));
                web3.eth.getBalance(accounts[0])
                  .then(console.log);

              });

            } else {
              setWalletAddress(accounts);
            }

            setConnected(accounts.length>0);
          });

          provider.on('connect', () => {
            setConnected(true);
            console.log("connected");
          });

          provider.on('disconnect', () => {
            setConnected(false);
            console.log("NOT connected");
          });


          //see if they are connected
          const connectedCheck = await checkWalletConnection();

          if (connectedCheck){
            //should have the connected address
            console.log("ARE connected");

            const address_list = await checkWalletAddress();

            setConnected(address_list.length > 0);

            if (address_list.length > 0){
              setWalletAddress(address_list[0]);


            } else {
              //no address so they need to connect
              setWalletAddress("");

            }

          } else {
            //there are no connected accounts
            //just show the button to make the connection
            console.log("ARE NOT connected");

            setWalletAddress("");

          }

        }

      }

    };
    initialCheck();
  }, []);



  const handleMenuClick = (e) => {
    console.log("switch network to : "+e.key);

  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {ChainNetworks().map((item) => (
        <Menu.Item key={item.key} icon={item.icon} style={styles.item}>
          <span style={{ marginLeft: "5px" }}>{item.value}</span>
        </Menu.Item>
      ))}
    </Menu>
  );


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
    } catch (e){}

    return provider;
  }


  function checkWalletConnection(){
    console.log("checkWalletConnection");

    return true;

  }

  async function checkWalletAddress(){
    console.log("checkWalletAddress");

    const provider = await getProvider();
    return await provider.request({ method: 'eth_accounts' })
  }


  async function getWalletAccounts(){

    var accounts = await web3.eth.getAccounts();

    web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
      .then(console.log);
  }

  const showPopup = async () => {
    console.log("---- showPopup");
    const provider = await getProvider();
    const accounts = await provider.request({ method: 'eth_requestAccounts' })

    //it may have been rejected ...
    setWalletAddress(accounts[0]);

  }

  const linkToMetamask = () => {
    console.log("---- linkToMetamask");
    window.open("https://metamask.io/download", "_blank");
  }


  const connectedDisplay = () => {
    console.log("---- connectedDisplay");
    console.log("---- wallet : "+wallet);
    console.log("---- connected : "+connected);
    console.log("---- walletAddress : "+walletAddress);


    if (wallet){
      //wallet is installed

      if (connected){
        //is connected
        return (
          <div style={styles.account}>
            <p style={{ marginRight: "5px", ...styles.text }}>
              {getEllipsisTxt(walletAddress, 6)}
            </p>
          </div>
        );
      } else {
        //needs to connect
        return(
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<WalletOutlined />}
            onClick={showPopup}
          >
            Connect wallet
          </Button>
        );
      }

    } else {
      //no wallet installed
      return (
        <Button
          type="warning"
          size="small"
          shape="round"
          icon={<ExclamationCircleOutlined />}
          onClick={linkToMetamask}
        >
          Install wallet
        </Button>
      );
    }

  }




  return (
    <>
      { connectedDisplay() }
    </>
  )

}

export default WalletChain;
