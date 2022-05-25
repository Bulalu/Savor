import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Button, Result } from "antd";
import { NavLink } from "react-router-dom";
import { getEllipsisTxt } from "../../helpers/formatters";


const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60; // Moment is also OK


function Earnings(props) {
  console.log("Earnings : "+JSON.stringify(props));


  const showDepositSuccess = () => {
    console.log("showDepositSuccess : "+props.depositSuccess);

    if (props.depositSuccess === null){
      return <></>;
    } else if (props.depositSuccess){
      return (
        <Card bordered="true">
          <Row gutter={16} style={{marginTop: "20px"}}>
            <Col span={24}>
              <Result
                status="success"
                title={`Successfully Deposited $${props.depositAmount} Into the Savor Vault!`}
                subTitle={`Transaction id : ${getEllipsisTxt(props.depositTransactionNumber, 6)}`}
                extra={[
                  <>
                    <Button
                      type="primary"
                      style={{marginLeft: "10px"}}
                      size="small"
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
        </Card>
      )
    } else {

      return (
        <Card bordered="true">
          <Row gutter={16} style={{marginTop: "20px"}}>
            <Col span={24}>
              <Result
                status="error"
                title="Deposit Failed"
                subTitle="Make sure you are depositing USDC and have enough gas."
                extra={
                  <>
                    <Button size="small" >
                      Try depositing again
                    </Button>
                  </>
                }
              />
            </Col>
          </Row>
        </Card>
      )
    }
  }







  return (
    <>
      {showDepositSuccess()}
    </>
  );

}

export default Earnings;
