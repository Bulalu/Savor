import React, { useEffect, useState } from "react";
import { useMoralisQuery, useMoralisSubscription } from "react-moralis";

const styles = {
  count: {
    fontSize: "16px",
    fontWeight: "500",
    marginLeft: "20px"
  },
};

function MyDeposits(props){

  console.log("MyDeposits : "+JSON.stringify(props));

  const [ limit, setLimit ] = useState(100);
  const [ depositData, setDepositData ] = useState([]);
  const [ depositCount, setDepositCount ] = useState(0);


  useEffect(() => {
    if (props.chainId === "0x4"){
      console.log("$$$$$$$$$$$$$$$$$$$$$$ need to fetch deposit data ...");

      fetch({
        onComplete: () => console.log("onComplete"),
        onSuccess: results => {
          console.log("!@!@!@!@ "+results);
          if (results.length > 0) {
            setDepositData(results);
            setDepositCount(depositData.length);
          }
        }
      });

    } else {
      setDepositData([]);
      setDepositCount(0);
    }

  }, [props.chainId]);



  const { fetch, data, isLoading} = useMoralisQuery(
    "RinkebyVaultDeposits",
    (query)=>query.equalTo("caller", props.currentAddress),
    [props.currentAddress],
    {
      autoFetch:true,
      live: true,
    });
  useMoralisSubscription(
    "RinkebyVaultDeposits",
    (q)=>q.equalTo("caller", props.currentAddress),
    [props.currentAddress],
    {
      onUpdate: () => fetch({
        onComplete: () => console.log("onComplete"),
        onSuccess: results => {
          console.log("!@!@!@!@ "+results);
          if (results.length > 0) {
            setDepositData(results);
            setDepositCount(depositData.length);
          }
        }
      }),
      enabled: true,
    });

  useEffect(()=>{
    if (!isLoading){
      console.log("!!! new DATA : "+data);
      if (data.length > 0) {
        setDepositData(data);
        setDepositCount(data.length);
        console.log("depositCount : " + data);
      }
    }
  }, [data]);


  return <span style={styles.count}>{depositCount===0?"":depositCount}</span>;

}

export default MyDeposits;

