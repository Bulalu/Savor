import Web3 from "web3";
import VaultAbi from "../ContractABIs/VaultAbi";
import USDCAbi from "../ContractABIs/USDCAbi";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";


function GetUserAllowance(chainId, account){

  console.log("chainId : "+chainId);

  const vaultAddress = "0x886b2a3dc127c1122c005669f726d5d37a135411";
  const USDCAddressRinkebyTestnet ="0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4";
  const USDCAddressPolygonTestnet ="0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7";

  const USDCAddressPolygonMainnet = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
  const USDCAddressAvalancheMainnet = "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e";

  let addressToUse="";
  let rpcURL;
  switch (chainId){
    case "0x4":
      addressToUse = USDCAddressRinkebyTestnet;
      rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
      break;
    case "0x13881":
      addressToUse = USDCAddressPolygonTestnet;
      rpcURL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/polygon/mumbai";
      break;
    case "0x89":
      addressToUse = USDCAddressPolygonMainnet;
      rpcURL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/polygon/mainnet";
      break;
    case "0xa86a":
      addressToUse = USDCAddressAvalancheMainnet;
      rpcURL = "https://speedy-nodes-nyc.moralis.io/0556d3438ef930ecbe80840f/avalanche/mainnet";
      break;
    default:

  }

  console.log("addressToUse : "+addressToUse);

  const getAllowance = async () => {

    const web3 = new Web3(rpcURL);
    const contract = await new web3.eth.Contract(USDCAbi(), addressToUse);

    return await contract.methods.allowance(account, vaultAddress).call((err, result) => {
      console.log("My Network Allowance : " + (result/1000000));
      return (result/1000000);
    });
  }

  return getAllowance();

}

export default GetUserAllowance;





function SetUserAllowance(chainId, amount){

  console.log("SetUserAllowance : "+chainId+" : "+amount);

  const vaultAddress = "0x886b2a3dc127c1122c005669f726d5d37a135411";
  const USDCAddress ="0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4";

  const setApproval = () => {
    console.log("setApproval");

    const checkAuth = async () => {
      const { authenticate, isAuthenticated } = useMoralis();
      console.log(isAuthenticated);
    }
    checkAuth();



    if (!isAuthenticated) {

/*
      await authenticate()
        .then(async function(user) {

          //ok to finish transaction
          const approveOptions = {
            contractAddress: USDCAddress,
            functionName: "approve",
            abi: USDCAbi(),
            params: {
              spender: vaultAddress,
              amount: amount,
            },
          };
          try {
            const transaction = await Moralis.executeFunction(approveOptions);
            console.log(transaction.hash);

            // Wait until the transaction is confirmed
            await transaction.wait();

            console.log("all done!!");

            return true;

          } catch (e){
            console.log(e);
            return false;
          }


        })
        .catch(function(error) {
          console.log(error);
          //disable the button and show spinner
          return error;
        });


    } else {

      //ok to finish transaction
      const approveOptions = {
        contractAddress: USDCAddress,
        functionName: "approve",
        abi: USDCAbi(),
        params: {
          spender: vaultAddress,
          amount: amount,
        },
      };
      try {
        const transaction = await Moralis.executeFunction(approveOptions);
        console.log(transaction.hash);

        // Wait until the transaction is confirmed
        await transaction.wait();

        console.log("all done!!");

        return true;

      } catch (e){
        console.log(e);
        return false;
      }
*/
    }
  }
  return setApproval();


}

export { SetUserAllowance };
