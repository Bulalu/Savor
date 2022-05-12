import Web3 from "web3";
import VaultAbi from "../ContractABIs/VaultAbi";
import USDCAbi from "../ContractABIs/USDCAbi";
import Moralis from "moralis";


function GetUserAllowance(chainId, account){

  console.log("chainId : "+chainId);

  const vaultAddress = "0x886b2a3dc127c1122c005669f726d5d37a135411";
  const USDCAddress ="0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4";

  const getAllowance = async () => {

    const rpcURL = "https://rinkeby.infura.io/v3/67df1bbfaae24813903d76f30f48b9fb";
    const web3 = new Web3(rpcURL);
    const contract = await new web3.eth.Contract(VaultAbi(), USDCAddress);

    return await contract.methods.allowance(account, vaultAddress).call((err, result) => {
      console.log("My Vault Allowance : " + (result/1000000));
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

  const setApproval = async() => {

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

  }

  return setApproval();

}

export { SetUserAllowance };
