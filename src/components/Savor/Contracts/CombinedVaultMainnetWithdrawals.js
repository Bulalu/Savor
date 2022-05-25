import React, { useEffect, useState } from "react";
import moment from "moment";
import Moment from "react-moment";
import { getEllipsisTxt } from "../../../helpers/formatters";
import NumberFormat from "react-number-format";
import { Table } from "antd";
import { useMoralisQuery } from "react-moralis";
import { AvaxLogo, PolygonLogo } from "../../Chains/Logos";


function CombinedVaultMainnetWithdrawals(props){
  console.log("CombinedVaultMainnetWithdrawals : "+JSON.stringify(props));

  /*
    get the withdrawal entries from Moralis for Avalanche and Polygon
   */
  const [ combinedWithdrawals, setCombinedWithdrawals ] = useState([]);

  //get the Avalanche deposit records
  const avalancheQuery  = useMoralisQuery(
    "AvalancheVaultWithdrawal",
    query => query.descending("block_timestamp"),
    [],
    {
      live: true,
      autoFetch: true
    },
  );

  useEffect(() => {
    console.log("Avalanche Withdrawal data just pushed from Moralis : "+avalancheQuery.data.length);
    if (avalancheQuery.data.length > 0) {
      console.log(JSON.stringify(avalancheQuery.data));
      combineBothWithdrawals(JSON.parse(JSON.stringify(avalancheQuery.data)), "0xa86a");
    }
  }, [avalancheQuery.data]);


  //get the Polygon deposit records
  const polygonQuery = useMoralisQuery(
    "PolygonVaultWithdrawals",
    query => query.descending("block_timestamp"),
    [],
    {
      live: true,
      autoFetch: true
    },
  );

  useEffect(() => {
    console.log("Polygon Withdrawal data just pushed from Moralis : "+polygonQuery.data.length);
    if (polygonQuery.data.length > 0) {
      console.log(JSON.stringify(polygonQuery.data));
      combineBothWithdrawals(JSON.parse(JSON.stringify(polygonQuery.data)), "0x89");
    }
  }, [polygonQuery.data]);




  //build the combined array
  function combineBothWithdrawals(newData, network){

    const newWithdrawalArray = combinedWithdrawals;

    for (const newItem of newData){
      newItem.network = network;
      let _exists = false;
      for (const existingItem in newWithdrawalArray){
        if (newItem.transaction_hash === newWithdrawalArray[existingItem].transaction_hash){
          _exists = true;
          newWithdrawalArray[existingItem] = newItem;
          break;
        }
      }

      if (!_exists){
        newWithdrawalArray.push(newItem);
      }

    }

    console.log("newWithdrawalArray : "+newWithdrawalArray);

    setCombinedWithdrawals(newWithdrawalArray);


  }



  const vault_columns = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
    },
    {
      title: '',
      dataIndex: 'network',
      key: 'network',
      align: 'right',
    },
  ];

  let vault_withdrawal_table_rows = [];

  //sort the array entries
  function withdrawalSort(a, b){
    const _a_Date = moment(a.block_timestamp.iso, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const _b_Date = moment(b.block_timestamp.iso, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

    if (_a_Date.isAfter(_b_Date)) {
      return -1;
    } else if (_a_Date.isBefore(_b_Date)) {
      return 1;
    } else {
      return 0;
    }
  }

  if (combinedWithdrawals.length > 1) {
    try {
      combinedWithdrawals.sort(withdrawalSort);
    } catch (e){}
  }

  let _myTotalWithdrawals = 0;
  try {
    vault_withdrawal_table_rows = combinedWithdrawals.map((transaction, i) => {

      if (props.currentAddress === transaction.caller){
        console.log("adding to the withdrawal total : "+transaction.assets);
        _myTotalWithdrawals += parseInt(transaction.assets) / 1000000;
        console.log("_myTotalWithdrawals : "+_myTotalWithdrawals);
      }

      return {
        key: i,
        account: getEllipsisTxt(transaction.caller, 6),

        amount: <>
          <span style={{ color: transaction.confirmed ? "black" : "red" }}>
            <NumberFormat prefix="$" value={transaction.assets / 1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
          </span>
        </>,

        network:<>
          {
            transaction.network==="0xa86a"?
              <a href={`https://snowtrace.io/tx/${transaction.transaction_hash}`} target="_blank">
                <AvaxLogo />
              </a>
              :
              <a href={`https://polygonscan.com/tx/${transaction.transaction_hash}`} target="_blank">
                <PolygonLogo />
              </a>
          }
        </>,

        description: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp.iso}</Moment>
      }

    });
  } catch (e){
    console.log(e);
  }

  props.setIntegratedWithdrawalCount(vault_withdrawal_table_rows.length);
  props.setMyTotalWithdrawalAmount(_myTotalWithdrawals);

  return (

    <Table dataSource={vault_withdrawal_table_rows} columns={vault_columns} />

  )

}

export default CombinedVaultMainnetWithdrawals;
