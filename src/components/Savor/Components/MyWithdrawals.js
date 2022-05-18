import React, { useEffect, useState } from "react";
import { useMoralisQuery, useMoralisSubscription } from "react-moralis";

const styles = {
  count: {
    fontSize: "16px",
    fontWeight: "500",
    marginLeft: "20px",
  },
};

function MyWithdrawals(props){

  console.log("MyWithdrawals : "+JSON.stringify(props));

  const [ limit, setLimit ] = useState(100);
  const [ withdrawalData, setWithdrawalData ] = useState([]);
  const [ withdrawalCount, setWithdrawalCount ] = useState(0);


  useEffect(() => {
    if (props.chainId === "0x4"){
      console.log("$$$$$$$$$$$$$$$$$$$$$$ need to fetch withdrawal data ...");

      fetch({
        onComplete: () => console.log("onComplete"),
        onSuccess: results => {
          console.log("!@!@!@!@ "+results);
          if (results.length > 0) {
            setWithdrawalData(results);
            setWithdrawalCount(depositData.length);
          }
        }
      });

    } else {
      setWithdrawalData([]);
      setWithdrawalCount(0);
    }

  }, [props.chainId]);



  const { fetch, data, isLoading} = useMoralisQuery(
    "RinkebyVaultWithdraw",
    (query)=>query.equalTo("caller", props.currentAddress),
    [props.currentAddress],
    {
      autoFetch:true,
      live: true,
    });
  useMoralisSubscription(
    "RinkebyVaultWithdraw",
    (q)=>q.equalTo("caller", props.currentAddress),
    [props.currentAddress],
    {
      onUpdate: () => fetch({
        onComplete: () => console.log("onComplete"),
        onSuccess: results => {
          console.log("!@!@!@!@ "+results);
          if (results.length > 0) {
            setWithdrawalData(results);
            setWithdrawalCount(depositData.length);
          }
        }
      }),
      enabled: true,
    });

  useEffect(()=>{
    if (!isLoading){
      console.log("!!! new DATA : "+data);
      if (data.length > 0) {
        setWithdrawalData(data);
        setWithdrawalCount(data.length);
        console.log("withdrawalCount : " + data.length);
      }
    }
  }, [data]);


  return <span style={styles.count}>{withdrawalCount===0?"":withdrawalCount}</span>;

}

export default MyWithdrawals;

