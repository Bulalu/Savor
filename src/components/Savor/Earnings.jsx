import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Button, Result } from "antd";
import { NavLink } from "react-router-dom";


const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60; // Moment is also OK


function Earnings(props) {
  console.log("Earnings : "+JSON.stringify(props));


  const showDepositSuccess = () => {
    console.log("showDepositSuccess : "+props.depositSuccess);

    if (props.depositSuccess === null){
      return null;
    } else if (props.depositSuccess){
      return (
        <Row gutter={16} style={{marginTop: "20px"}}>
          <Col span={24}>
            <Result
              status="success"
              title={`Successfully Deposited $${props.depositAmount} Into the Savor Vault!`}
              subTitle={`Transaction id : ${props.depositTransactionNumber}`}
              extra={[
                <>
                  <NavLink to="/dashboard">
                    <Button type="primary" size="large" >
                      Go to dashboard
                    </Button>
                  </NavLink>
                  <Button
                    style={{marginLeft: "10px"}}
                    size="large"
                    onClick={()=>{
                      props.setCurrent(1)
                    }}
                  >
                    Make new deposit
                  </Button>
                </>
              ]}
            />
          </Col>
        </Row>
      )
    } else {

      return (
        <Row gutter={16} style={{marginTop: "20px"}}>
          <Col span={24}>
            <Result
              status="error"
              title="Deposit Failed"
              subTitle="Make sure you are depositing USDC and have enough gas."
              extra={
                <>
                  <Button size="large" >
                    Try depositing again
                  </Button>
                </>
              }
            />
          </Col>
        </Row>
      )
    }
  }







  return (
    <Card bordered="true">
      <Row gutter={16}>
        <Col span={12}>
          <Countdown title="Next payout in" value={deadline} />
        </Col>
      </Row>

      {showDepositSuccess()}

    </Card>
  );

}

export default Earnings;
