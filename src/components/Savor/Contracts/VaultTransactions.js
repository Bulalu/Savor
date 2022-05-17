import React, { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import Moralis from "moralis";
import { Card, Table } from "antd";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import { getEllipsisTxt } from "../../../helpers/formatters";

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
  console.log("VaultLiveQueriesDeposits");


  const [limit, setLimit] = useState(100);
  const [depositData, setDepositData] = useState([]);

  const { fetch, data, error, isLoading } = useMoralisQuery(
    "RinkebyVaultDeposits",
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
          console.log(" ------ the deposits length : " + result.length);
          addNewDepositData(result);
        }
      });
    }
  }, [props.chainId]);

  useEffect(() => {
    console.log("Deposit data just pushed from Moralis : "+JSON.stringify(data));
    if (data.length > 0) {
      addNewDepositData(data);
    }
  }, [data]);


  function addNewDepositData(arrayOfData){
    console.log("addNewDepositData : "+arrayOfData+" -> "+depositData);

    try {
      //arrayOfData may be empty or undefined
      let _currentData = JSON.parse(JSON.stringify(depositData));

      if (_currentData.length === 0) {

        setDepositData(arrayOfData);

      } else {

        const _newDataToAdd = [];
        //get a deep copy
        console.log("currentData : " + _currentData);

        for (const _newItem of arrayOfData) {
          console.log("working on item : " + _newItem.get("transaction_hash"));

          let _exists = false;

          for (const item of _currentData) {
            console.log("comparing : " + item.transaction_hash + " : " + _newItem.get("transaction_hash"));
            if (item.transaction_hash === _newItem.get("transaction_hash")) {
              console.log("DO MATCH !!!");
              _exists = true;
              break;
            }

          }
          if (!_exists) {
            _newDataToAdd.push(_newItem);
          }
        }
        console.log("adding new item(s) : " + _newDataToAdd.length);
        if (_newDataToAdd > 0) {
          for (const item of _newDataToAdd) {
            console.log("^^^^^ " + item);
            _currentData.push(item);
          }
          //update the state
          console.log("the new withdrawal items : " + _currentData);
          setDepositData(_currentData);
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
  try {
    vault_deposit_table_rows = depositData.map((transaction, i) => {

      const address = transaction.get("owner");

      return {
        key: i,
        block_timestamp: <Moment format="dddd, MMM Do h:mm A">{transaction.get("block_timestamp")}</Moment>,
        depositor: getEllipsisTxt(address, 6),
        amount: <NumberFormat prefix="$" value={transaction.get("assets") / 1000000} displayType={'text'}
                              thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      }
    });
  } catch (e){
    console.log(e);
  }

  console.log("vault_deposit_table_rows : "+vault_deposit_table_rows)

  return (
    <Card style={styles.card} title="Deposits (RinkebyVaultDeposits)">
      <Table dataSource={vault_deposit_table_rows} columns={vault_columns} />;
    </Card>
  );
}

export default VaultLiveQueriesDeposits;





function VaultLiveQueriesWithdraws(props) {
  console.log("VaultLiveQueriesWithdraws");



  const [limit, setLimit] = useState(100);
  const [withdrawData, setWithdrawData] = useState([]);

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
          console.log(" ------ the withdrawals length : " + result.length);
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
    console.log("addNewWithdrawalData : "+arrayOfData+" -> "+withdrawData);

    try {
      let _currentData = JSON.parse(JSON.stringify(withdrawData));

      if (_currentData.length === 0) {

        setWithdrawData(arrayOfData);

      } else {

        const _newDataToAdd = [];
        //get a deep copy
        console.log("currentData : " + _currentData);

        for (const _newItem of arrayOfData) {
          console.log("working on item : " + _newItem.get("transaction_hash"));

          let _exists = false;

          for (const item of _currentData) {
            console.log("comparing : " + item.transaction_hash + " : " + _newItem.get("transaction_hash"));
            if (item.transaction_hash === _newItem.get("transaction_hash")) {
              console.log("DO MATCH !!!");
              _exists = true;
              break;
            }

          }
          if (!_exists) {
            _newDataToAdd.push(_newItem);
          }
        }
        console.log("adding new item(s) : " + _newDataToAdd.length);
        if (_newDataToAdd > 0) {
          for (const item of _newDataToAdd) {
            console.log("^^^^^ " + item);
            _currentData.push(item);
          }
          //update the state
          console.log("the new withdrawal items : " + _currentData);
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

  console.log("vault_withdrawal_table_rows : "+vault_withdrawal_table_rows)

  return (
    <div>
      <Card style={styles.card} title="Withdrawals (RinkebyVaultWithdrawals)">
        <Table dataSource={vault_withdrawal_table_rows} columns={vault_columns} />;
      </Card>
    </div>);
}

export { VaultLiveQueriesWithdraws };

