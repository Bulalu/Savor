import React, {useEffect, useState} from "react";
import Web3 from "web3";
import VaultAbi from "./ContractABIs/VaultAbi";
import { useMoralis, useMoralisWeb3Api, useWeb3Transfer } from "react-moralis";
import Moralis from "moralis";

import { Card, Button } from "antd";
import GetUserAllowance, { SetUserAllowance } from "./Contracts/USDC";

const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
  },
  input: {

    fontWeight: "500",
    fontSize: "23px",
    display: "block",

    width: "100%",
    height: "30px",
    padding: "0 11px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "0",
    borderRadius: "2px",
    outline: "0",
    transition: "all 0.3s linear",
  },
  priceSwap: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
    color: "#434343",
    marginTop: "8px",
    padding: "0 10px",
  },
};

const Withdraw = () => {

  const Web3Api = useMoralisWeb3Api();

  /*
      for the Vault
   */
  const [ contractAddress, setContractAddress ] = useState("0x886b2a3dc127c1122c005669f726d5d37a135411");
  const [ vaultName, setVaultName ] = useState("");
  const [ vaultSupply, setVaultSupply ] = useState(0);
  const [ vaultAssets, setVaultAssets ] = useState(0);
  const [ vaultAPY, setVaultAPY ] = useState(5.87);
  const [ lastHarvest, setLastHarvest ] = useState(0);
  const [ vaultTransactions, setVaultTransactions ] = useState([]);

  /*
      for the User
   */
  const [ myAllowance, setMyAllowance ] = useState(0);
  const [ myVaultBalance, setMyVaultBalance ] = useState(0);
  const [ amountEarned, setAmountEarned ] = useState(0);
  const [ depositAmount, setDepositAmount ] = useState([]);
  const [ withdrawalAmount, setWithdrawalAmount ] = useState(0);
  const [ myTransactions, setMyTransactions ] = useState([]);
  const [ depositStatus, setDepositStatus ] = useState("");
  const [ withdrawalStatus, setWithdrawalStatus ] = useState("");

  const { user, account, chainId } = useMoralis();

  console.log("------------------------ : "+chainId);

  useEffect(()=>{
    console.log("the user account : "+account);

    if (account !== null){
      getUserDetails();
    }

  }, [account]);

  //get user details
  async function getUserDetails(){

    console.log("getUserDetails");

    const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
    const web3 = new Web3(rpcURL);
    const contract = await new web3.eth.Contract(VaultAbi(), contractAddress);

    console.log("Got the Contract!!");
    setMyAllowance(await GetUserAllowance(chainId, account));

    contract.methods.balanceOf(account).call((err, result) => {
      console.log("My Vault Balance : "+result/1000000);
      setMyVaultBalance(result/1000000);
      setWithdrawalAmount(result/1000000);
    });

    const fetchTransactions = async () => {

      // get Rinkeby transactions for a given address
      // with most recent transactions appearing first
      const options = {
        chain: chainId,
        address: account,
        order: "desc",
        from_block: "0",
      };
      const rinkebyTransactions = await Web3Api.account.getTransactions(options);

      setMyTransactions(rinkebyTransactions.result);

      console.log(rinkebyTransactions.result);
    };
    fetchTransactions();
  }

  function updateWithdrawalAmount(event){
    setWithdrawalAmount(event.target.value);
  }

  async function makeWithdrawal() {
    /*
      ** requirements **

      network provider
      signer
      wallet address
      contract
      withdrawal amount (assets)

      ** to-do **
      check to make sure values are within boundaries

        //check the allowance amount - otherwise need to do an approval before
     */

    //make the withdrawal
    const withdrawalOptions = {
      contractAddress: "0x886b2a3dc127c1122c005669f726d5d37a135411",
      functionName: "withdraw",
      abi: VaultAbi(),
      params: {
        assets: withdrawalAmount+"000000",
        receiver: account,
        owner: account
      },
    };

    try {
      const transaction = await Moralis.executeFunction(withdrawalOptions);
      console.log(transaction.hash);
      // Wait until the transaction is confirmed
      await transaction.wait();
      getUserDetails();

    } catch (e){
      console.log(e);
    }
  }

  return(
    <>

      <Card style={styles.card} bodyStyle={{ padding: "18px" }}>
        <Card
          style={{ borderRadius: "1rem" }}
          bodyStyle={{ padding: "0.8rem" }}
        >
          <div
            style={{ marginBottom: "5px", fontSize: "14px", color: "#434343" }}
          >
            Withdraw
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap",
            }}
          >
            <div>
              <input
                placeholder="0.00"
                style={{ ...styles.input, marginLeft: "-10px" }}
                onChange={updateWithdrawalAmount}
                value={withdrawalAmount}
              />
            </div>
          </div>
        </Card>

        <Button
          type="primary"
          size="large"
          style={{
            width: "100%",
            marginTop: "15px",
            borderRadius: "0.6rem",
            height: "50px",
          }}
          onClick={() => makeWithdrawal() }
          //disabled={!ButtonState.isActive}
        >
          Withdraw
        </Button>
        <p>{ withdrawalStatus }</p>
      </Card>
    </>
  );
};

export default Withdraw;
