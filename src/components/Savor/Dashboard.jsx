
import React, {useEffect, useState} from "react";
import Web3 from "web3";
import VaultAbi from "VaultAbi";
import {useMoralis, useMoralisWeb3Api, useWeb3Transfer} from "react-moralis";
import Moralis from "moralis";
import ErrorMessage from "ErrorMessage";

import {Button, Col, Row, Layout, Card, Table} from "antd";
import NumberFormat from 'react-number-format';
import Moment from "react-moment";

const styles = {
    card: {
        width: "430px",
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "1rem",
        fontSize: "16px",
        fontWeight: "500",
    },
};


const Dashboard = () => {

  const Web3Api = useMoralisWeb3Api();

    /*
        for the Vault
     */
    const [ contractAddress, setContractAddress ] = useState("0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3");
    const [ vaultName, setVaultName ] = useState("");
    const [ vaultSupply, setVaultSupply ] = useState(0);
    const [ vaultAssets, setVaultAssets ] = useState(0);
    const [ vaultAPY, setVaultAPY ] = useState(5.87);
    const [ lastHarvest, setLastHarvest ] = useState(0);
    const [ vaultTransactions, setVaultTransactions ] = useState([]);

    /*
        for the user
     */
    const [ myAllowance, setMyAllowance ] = useState(0);
    const [ myVaultBalance, setMyVaultBalance ] = useState(0);
    const [ amountEarned, setAmountEarned ] = useState(0);
    const [ depositAmount, setDepositAmount ] = useState(0);
    const [ myTransactions, setMyTransactions ] = useState([]);

    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout, chainId } = useMoralis();

    console.log("------------------------ : ");


    useEffect(()=>{

        async function fetchContractInfo() {
            console.log("fetchContractInfo");

            const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
            const web3 = new Web3(rpcURL);
            const contract = await new web3.eth.Contract(VaultAbi(), contractAddress);

            console.log("Got the Contract!!");

            contract.methods.name().call((err, result) => {
                console.log("Vault Name : "+result);
                setVaultName(result);
            });

            contract.methods.totalSupply().call((err, result) => {
                console.log("vault supply : "+result);
                setVaultSupply(result);
            });

            contract.methods.totalAssets().call((err, result) => {
                console.log("vault assets : "+result);
                setVaultAssets(result);
            });

            contract.methods.lastHarvest().call((err, result) => {
                console.log("last harvest : "+result);
                setLastHarvest(result);
            });


            //get the Vault transactions




        }
        fetchContractInfo();


    }, [contractAddress]);

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

        contract.methods.allowance(account, contractAddress).call((err, result) => {
            console.log("My Vault Allowance : "+result);
            setMyAllowance(result);
        });

        contract.methods.balanceOf(account).call((err, result) => {
            console.log("My Vault Balance : "+result);
            setMyVaultBalance(result);
        });



        const fetchTransactions = async () => {

            // get Rinkeby transactions for a given address
            // with most recent transactions appearing first
            const options = {
                chain: "0x4",
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


    function updateDepositAmount(event){
        setDepositAmount(event.target.value);
        console.log("updateDepositAmount : "+event.target.value);
    }

    async function makeDeposit(){

/*
        const provider = ethers.getDefaultProvider("rinkeby", {
            infura: "67df1bbfaae24813903d76f30f48b9fb",
            // Or if using a project secret:
            // infura: {
            //   projectId: YOUR_INFURA_PROJECT_ID,
            //   projectSecret: YOUR_INFURA_PROJECT_SECRET,
            // },
        });
        const signer = provider.getSigner();
*/

        const sendOptions = {
            contractAddress: "0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3",
            functionName: "deposit",
            abi: VaultAbi(),
            params: {
                assets: Moralis.Units.Token(.00001, 18),
                receiver: account,
            },
        };

        try {
            const transaction = await Moralis.executeFunction(sendOptions);
            console.log(transaction.hash);
                // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

                // Wait until the transaction is confirmed
            await transaction.wait();


                // Read new value
            const readOptions = {
                contractAddress: "0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3",
                functionName: "balanceOf",
                abi: VaultAbi(),
                params: {
                    account
                },
            }

            const message = await Moralis.executeFunction(readOptions);
            console.log(message);

        } catch (e){
            console.log(e);
        }
    }


    const TransferWeth = () => {
        const { fetch, error, isFetching } = useWeb3Transfer({
            amount: Moralis.Units.Token(.00001, 18),
            receiver: account,
            type: "erc20",
            contractAddress: "0x512c0bb530b27253b4644C8D5a3016CbF02ee8A3",
        });

        return (
            // Use your custom error component to show errors
            <div>
                {error && <ErrorMessage error={error} />}
                <button onClick={() => fetch()} disabled={isFetching}>
                    Coin Deposit
                </button>
            </div>
        );
    };




    /*
        for the transaction table
     */
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
    ];

    function checkMyTransaction(transaction) {
        return (transaction.from_address===account || transaction.to_address===account);
    }

    const table_rows = myTransactions.filter(checkMyTransaction).map((transaction, i)=>{

        return {
            key: i,
            block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp}</Moment>,
            from_address: transaction.from_address === account? "your wallet - "+transaction.from_address.substring(0,4)+"..."+transaction.from_address.substring(transaction.from_address.length-4, transaction.from_address.length): transaction.from_address,
            to_address: transaction.to_address === account? "your wallet - "+transaction.to_address.substring(0,4)+"..."+transaction.to_address.substring(transaction.to_address.length-4, transaction.to_address.length): transaction.to_address,
            receipt_gas_used: transaction.receipt_gas_used,
        }
    })

    console.log("SavorDashboardContent");

    return(

        <Layout>
            <Row>

                <Col span={12}>
                    <Card style={styles.card} title={vaultName} bodyStyle={{ padding: "18px" }}>
                        <p>Supply : { <NumberFormat value={vaultSupply} displayType={'text'} thousandSeparator={true} /> }</p>
                        <p>Assets : { <NumberFormat value={vaultAssets} displayType={'text'} thousandSeparator={true} /> }</p>
                        <p>Last Harvest : { lastHarvest }</p>
                        <p>APY : { vaultAPY }%</p>
                    </Card>

                </Col>

                <Col span={12}>
                    <div>
                        <h1>My Allowance : { myAllowance }</h1>
                        <h1>My Deposits : { myVaultBalance }</h1>
                        <h1>Amount Earned : { amountEarned }</h1>


                        <input onChange={ updateDepositAmount } value={ depositAmount } />
                        <input type="button" onClick={ makeDeposit } value="Make Deposit"/>
                    </div>

                    <TransferWeth />
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Table dataSource={table_rows} columns={columns} />;
                </Col>
            </Row>
        </Layout>


    );
};

export default Dashboard;


