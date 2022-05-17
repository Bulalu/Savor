import React, { useEffect, useState } from "react";
import { useMoralisQuery, useMoralisSubscription } from "react-moralis";
import { Card, Table } from "antd";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import { getEllipsisTxt } from "../../../helpers/formatters";

import moment from 'moment'
import 'moment-timezone'

const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "12px",
    fontWeight: "500",
  },
};


function VaultLiveQueriesDeposits(props) {
  console.log("VaultLiveQueriesDeposits : "+JSON.stringify(props));


  const [limit, setLimit] = useState(20);
  const [depositData, setDepositData] = useState([]);

  const { fetch, data, error, isLoading } = useMoralisQuery(
    "RinkebyVaultDeposits",
    query =>
      query.descending("block_timestamp")
        .limit(limit),
    [limit],
    {
      autoFetch: true
    },
  );

  useEffect(() => {
    if (!isLoading){
      fetch({
        onComplete: () => console.log("onComplete"),
        onSuccess: (result) => {
          console.log("onSuccess");
          console.log(" ------ the deposits length : " + result.length);
//          addNewDepositData(result);

          setDepositData(result);
        }
      });
    }
  }, [props.chainId]);

  useEffect(() => {
    console.log("Deposit data just pushed from Moralis : "+JSON.stringify(data));
    if (data.length > 0) {
//      addNewDepositData(data);

      setDepositData(data);
    }
  }, [data]);


  //this gets triggered from PUSH updates
  useMoralisSubscription("RinkebyVaultDeposits",
    (q) => q,
    [],
    {
      onUpdate: (data) => {
        console.log("- incoming DEPOSIT data -- "+JSON.stringify(data))
        addNewDepositData(data);
      },
    enabled: true,
  });



  function addNewDepositData(newDepositData){
    console.log("addNewDepositData");

    if (depositData.length === 0) {
      setDepositData([newDepositData]);
    } else {

      let _currentDepositData = JSON.parse(JSON.stringify(depositData));

      let _exists = false;
      for (const item in _currentDepositData) {
        console.log("comparing : " + _currentDepositData[item].transaction_hash + " : " + newDepositData.get("transaction_hash"));

        if (_currentDepositData[item].transaction_hash === newDepositData.get("transaction_hash")) {
          _exists = true;

          //update the entry
          _currentDepositData[item] = newDepositData;

          break;
        }
      }
      if (_exists) {
        //just updated a single item
        console.log("Just updating an existing item");
        setDepositData(_currentDepositData);
      } else {
        //add new item
        console.log("new item to add!!");
        setDepositData([...depositData, newDepositData]);
      }
    }

  }



  const vault_columns = [
    {
      title: 'Timestamp',
      dataIndex: 'block_timestamp',
      key: 'timestamp',
    },
    {
      title: 'Who',
      dataIndex: 'depositor',
      key: 'depositor',
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
    console.log("a: "+a.get("block_timestamp"));
    console.log("a: "+moment(a.get("block_timestamp"), 'YYYY-MM-DDTHH:mm:ss.SSSZ'));

    const _a_Date = moment(a.get("block_timestamp"), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const _b_Date = moment(b.get("block_timestamp"), 'YYYY-MM-DDTHH:mm:ss.SSSZ');

    if (_a_Date.isAfter(_b_Date)) {
      return -1;
    } else if (_a_Date.isBefore(_b_Date)) {
      return 1;
    } else {
      return 0;
    }
  }

  if (depositData.length > 1) {
    try {
      depositData.sort(depositSort);
    } catch (e){}
  }

  console.log("depositData after sorting: "+JSON.stringify(depositData));


  try {
    vault_deposit_table_rows = depositData.map((transaction, i) => {

      const trx = JSON.parse(JSON.stringify(transaction));
      console.log("@@@ trx : "+trx);

        return {
          key: i,
          block_timestamp: <><span style={{ color: trx.confirmed ? "black" : "red" }}><Moment
            format="dddd, MMM Do h:mm A">{ trx.block_timestamp.iso }</Moment></span></>,
          depositor: getEllipsisTxt(trx.owner, 6),
          amount: <NumberFormat prefix="$" value={trx.assets / 1000000} displayType={'text'}
                                thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
        }


    });
  } catch (e){
    console.log(e);
  }

//  console.log("vault_deposit_table_rows : "+vault_deposit_table_rows)

  return (
    <Card style={styles.card} title="Deposits (RinkebyVaultDeposits)">
      <Table dataSource={vault_deposit_table_rows} columns={vault_columns} />;
    </Card>
  );
}

export default VaultLiveQueriesDeposits;





function VaultLiveQueriesWithdraws(props) {
  console.log("VaultLiveQueriesWithdraws"+JSON.stringify(props));



  const [limit, setLimit] = useState(20);
  const [withdrawData, setWithdrawData] = useState([]);

  const { fetch, data, error, isLoading } = useMoralisQuery(
    "RinkebyVaultWithdraw",
    query =>
      query.descending("block_timestamp")
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
          console.log("onSuccess");
//          console.log(" ------ the withdrawals length : " + result.length);
          addNewWithdrawalData(result);
        }
      });
    }
  }, [props.chainId]);

  useEffect(() => {
    console.log("Withdrawal data just pushed from Moralis : "+JSON.stringify(data));
    if (data.length > 0){
      addNewWithdrawalData(data);
    }
  }, [data]);


  function addNewWithdrawalData(arrayOfData){
//    console.log("addNewWithdrawalData : "+arrayOfData+" -> "+withdrawData);

    try {
      let _currentData = JSON.parse(JSON.stringify(withdrawData));

      if (_currentData.length === 0) {

        setWithdrawData(arrayOfData);

      } else {

        const _newDataToAdd = [];
        //get a deep copy
//        console.log("currentData : " + _currentData);

        for (const _newItem of arrayOfData) {
//          console.log("working on item : " + _newItem.get("transaction_hash"));

          let _exists = false;

          for (const item of _currentData) {
//            console.log("comparing : " + item.transaction_hash + " : " + _newItem.get("transaction_hash"));
            if (item.transaction_hash === _newItem.get("transaction_hash")) {
//              console.log("DO MATCH !!!");
              _exists = true;
              break;
            }

          }
          if (!_exists) {
            _newDataToAdd.push(_newItem);
          }
        }
//        console.log("adding new item(s) : " + _newDataToAdd.length);
        if (_newDataToAdd > 0) {
          for (const item of _newDataToAdd) {
//            console.log("^^^^^ " + item);
            _currentData.push(item);
          }
          //update the state
//          console.log("the new withdrawal items : " + _currentData);
          setWithdrawData(_currentData);
        }

      }

    } catch (e){}

  }




  const vault_columns = [
    {
      title: 'Timestamp',
      dataIndex: 'block_timestamp',
      key: 'timestamp',
    },
    {
      title: 'Receiver',
      dataIndex: 'receiver',
      key: 'receiver',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
    },
  ];

  let vault_withdrawal_table_rows = [];
  try {
    vault_withdrawal_table_rows = withdrawData.map((transaction, i) => {

      const address = transaction.get("receiver");

      return {
        key: i,
        block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.get("block_timestamp")}</Moment>,
        receiver: getEllipsisTxt(address, 6),
        amount: <NumberFormat prefix="$" value={transaction.get("assets") / 1000000} displayType={'text'}
                              thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      }
    })
  } catch (e){
    console.log(e);
  }

//  console.log("vault_withdrawal_table_rows : "+vault_withdrawal_table_rows)

  return (
    <div>
      <Card style={styles.card} title="Withdrawals (RinkebyVaultWithdrawals)">
        <Table dataSource={vault_withdrawal_table_rows} columns={vault_columns} />;
      </Card>
    </div>);
}

export { VaultLiveQueriesWithdraws };

