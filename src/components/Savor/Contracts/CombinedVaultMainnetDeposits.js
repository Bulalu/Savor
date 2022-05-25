import React, { useEffect, useState } from "react";
import moment from "moment";
import Moment from "react-moment";
import { getEllipsisTxt } from "../../../helpers/formatters";
import NumberFormat from "react-number-format";
import { Table } from "antd";
import { useMoralisQuery, useMoralisSubscription } from "react-moralis";


function CombinedVaultMainnetDeposits(props){
  console.log("CombinedVaultMainnetDeposits : "+JSON.stringify(props));

  /*
    get the deposit entries from Moralis for Avalanche and Polygon
   */
  const [ combinedDeposits, setCombinedDeposits ] = useState([]);

  //get the Avalanche deposit records
  const avalancheQuery  = useMoralisQuery(
    "AvalancheVaultDeposits",
    query => query.descending("block_timestamp"),
    [],
    {
      live: true,
      autoFetch: true
    },
  );

  useEffect(() => {
    console.log("Avalanche Deposit data just pushed from Moralis : "+avalancheQuery.data.length);
    if (avalancheQuery.data.length > 0) {
      console.log(JSON.stringify(avalancheQuery.data));
      combineBothDeposits(JSON.parse(JSON.stringify(avalancheQuery.data)));
    }
  }, [avalancheQuery.data]);


  //get the Polygon deposit records
  const polygonQuery = useMoralisQuery(
    "PolygonVaultDeposits",
    query => query.descending("block_timestamp"),
    [],
    {
      live: true,
      autoFetch: true
    },
  );

  useEffect(() => {
    console.log("Polygon Deposit data just pushed from Moralis : "+polygonQuery.data.length);
    if (polygonQuery.data.length > 0) {
      console.log(JSON.stringify(polygonQuery.data));
      combineBothDeposits(JSON.parse(JSON.stringify(polygonQuery.data)));
    }
  }, [polygonQuery.data]);



  //build the combined array
  function combineBothDeposits(newData){
    console.log("combineBothDeposits : ");

    const newDepositArray = combinedDeposits;

    for (const newItem of newData){
      let _exists = false;
      for (const existingItem in newDepositArray){
        if (newItem.transaction_hash === newDepositArray[existingItem].transaction_hash){
          _exists = true;
          newDepositArray[existingItem] = newItem;
          break;
        }
      }

      if (!_exists){
        newDepositArray.push(newItem);
      }

    }

    console.log("newDepositArray : "+newDepositArray);

    setCombinedDeposits(newDepositArray);

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
  ];

  let vault_deposit_table_rows = [];

  //sort the array entries
  function depositSort(a, b){
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

  if (combinedDeposits.length > 1) {
    try {
      combinedDeposits.sort(depositSort);
    } catch (e){}
  }

  let _myTotalDeposits = 0;
  try {
    vault_deposit_table_rows = combinedDeposits.map((transaction, i) => {

      if (props.currentAddress === transaction.caller){
        _myTotalDeposits += transaction.assets;
      }

      return {
        key: i,
        account: getEllipsisTxt(transaction.caller, 6),
        amount: <NumberFormat prefix="$" value={transaction.assets / 1000000} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />,
        description: <Moment format="dddd, MMM Do h:mm A">{transaction.block_timestamp.iso}</Moment>
      }

    });
  } catch (e){
    console.log(e);
  }

  props.setIntegratedDepositCount(vault_deposit_table_rows.length);
  props.setMyTotalDepositAmount(_myTotalDeposits);


  return (

    <Table
      dataSource={vault_deposit_table_rows}
      columns={vault_columns}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0, textAlign:"right", fontSize:"11px" }}>{record.description}</p>
        ),
        rowExpandable: (record) => record.level !== "3",
        onExpand: (expanded, record) =>
          console.log("onExpand: ", record, expanded),
      }}
    />
  )

}

export default CombinedVaultMainnetDeposits;
