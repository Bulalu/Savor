import { Button, Card, Col, Input, Layout, Row, Table } from "antd";
import Vault from "./Contracts/Vault";
import NumberFormat from "react-number-format";
import VaultLiveQueriesDeposits from "./Contracts/VaultTransactions";
import React from "react";

<Layout>
  <Row>

    <Col md={6} sm={24} xs={24}>

      <Vault myVaultBalance={myVaultBalance}/>

    </Col>

    <Col md={6} sm={24} xs={24}>
      <Card style={styles.card} title="My Account" bodyStyle={{ padding: "18px", fontSize:"12px" }}>
        <Row>
          <Col span={12}>Allowance : </Col>
          <Col span={12} style={{textAlign:"end"}}>{ myAllowance===0?0:"Maximum" } </Col>
        </Row>

        <Row>
          <Col span={12}>Balance : </Col>
          <Col span={12} style={{textAlign:"end"}}>${ <NumberFormat
            value={(myVaultBalance+(myVaultTotalUserBalance-myVaultBalance))}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true} /> }</Col>
        </Row>

        <Row>
          <Col span={16}>Pending Payout : </Col>
          <Col span={8} style={{textAlign:"end"}}>${ <NumberFormat
            value={(myVaultTotalUserBalance-myVaultBalance)}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true} /> }</Col>
        </Row>

        <Row>
          <Col span={12}>Amount Earned : </Col>
          <Col span={12} style={{textAlign:"end"}}>${ amountEarned } </Col>
        </Row>

        <Row>
          <Col span={12}>Network : </Col>
          <Col span={12} style={{textAlign:"end"}}>{chainId}</Col>
        </Row>

        <Row>
          <Col span={12}>Wallet Address : </Col>
          <Col span={12} style={{textAlign:"end"}}>{ account?account.substring(0,4)+"..."+account.substring(account.length-4, account.length):"" }</Col>
        </Row>


      </Card>
    </Col>

    <Col md={6} sm={24} xs={24}>
      <Card style={styles.card} title="Deposit Testing" bodyStyle={{ padding: "18px" }}>
        <Input onChange={ updateDepositAmount } value={ depositAmount>0?depositAmount:"" } suffix="USDC" />
        <Button
          type="primary"
          size="small"
          style={{
            width: "100%",
            marginTop: "15px",
            borderRadius: "0.6rem",
            height: "50px",
          }}
          onClick={ makeDeposit }
          disabled={depositStatus}
        >
          Make Deposit
        </Button>

        <p>{ depositStatus }</p>
      </Card>
    </Col>

    <Col md={6} sm={24} xs={24}>
      <Card style={styles.card} title="Withdrawal Testing" bodyStyle={{ padding: "18px" }}>
        <Input onChange={ updateWithdrawalAmount } value={ withdrawalAmount>0?withdrawalAmount:"" } suffix="USDC" />

        <Button
          type="primary"
          size="small"
          style={{
            width: "100%",
            marginTop: "15px",
            borderRadius: "0.6rem",
            height: "50px",
          }}
          onClick={ makeWithdrawal }
          disabled={ withdrawalStatus }
        >
          Make Withdrawal
        </Button>

        <p>{ withdrawalStatus }</p>
      </Card>
    </Col>

  </Row>

  {/*
        <Row>
          <Col span={24}>
            <Table dataSource={table_rows} columns={columns} />;
          </Col>
        </Row>
      */}

  <Row>
    <Col span={24}>
      <VaultLiveQueriesDeposits chainId={chainId}/>
    </Col>
  </Row>



  <Row>
    <Col span={12} >
      <Card style={styles.card} title="Deposits">
        <Table dataSource={vault_deposit_table_rows} columns={vault_columns} />;
      </Card>
    </Col>
    <Col span={12} >
      <Card style={styles.card} title="Withdrawals">
        <Table dataSource={vault_withdrawal_table_rows} columns={vault_columns} />;
      </Card>
    </Col>
  </Row>

</Layout>
