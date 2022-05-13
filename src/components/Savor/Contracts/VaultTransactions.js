import React, { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import Moralis from "moralis";



function VaultLiveQueriesDeposits(props) {
  console.log("VaultLiveQueriesDeposits");

/*
  const [limit, setLimit] = useState(100);

  const { fetch } = useMoralisQuery(
    "RinkebyVaultDeposits",
    (query) => query,
    [],
    { autoFetch: true }
  );

  const basicQuery = async () => {

    try {
      const results = await fetch();
      console.log("Successfully retrieved " + results.length + " RinkebyVaultDeposits.");
      // Do something with the returned Moralis.Object values
      for (let i = 0; i < results.length; i++) {
        const object = results[i];
        console.log(object.id + " - " + object.get("assets"));
      }
    } catch(e){
      console.log(e);
    }
  };

  return <button onClick={basicQuery}>Call The Code</button>
*/

/*
  const [limit, setLimit] = useState(100);
  const [depositData, setDepositData] = useState([]);


  async function getRecords(){

    let query = new Moralis.Query('RinkebyVaultDeposits');
    let subscription = await query.subscribe();


    subscription.on('open', () => {
      console.log('subscription opened');
    });
    subscription.on('create', (object) => {
      console.log('object created : '+object);
    });
    subscription.on('update', (object) => {
      console.log('object updated : '+object);
    });
    subscription.on('close', () => {
      console.log('subscription closed');
    });
  }
  getRecords();

*/


  const [limit, setLimit] = useState(10);
  const [depositData, setDepositData] = useState([]);

  const { fetch, data, error, isLoading } = useMoralisQuery(
    "RinkebyVaultWithdraw",
    query =>
      query
        .limit(limit),
    [limit],
    {
      live: true,
      autoFetch: true
    },
  );

  useEffect(() => {
    if (!isLoading){
      fetch({
        onComplete: () => console.log("onComplete"),
        onSuccess: (result) => {
          console.log(" ------ the resultset : " + JSON.stringify(result, null, '\t'));

          //          setDepositData(result);
        }
      });
    }
  }, [props.chainId]);

  useEffect(() => {
    setDepositData(data);
  }, [data]);

  return (
    <div>
      <h1>{depositData}</h1>
      <button onClick={fetch}>Call The Code</button>
    </div>);
}

export default VaultLiveQueriesDeposits;
