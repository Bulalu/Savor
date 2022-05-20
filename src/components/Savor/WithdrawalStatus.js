import React from "react";
import { Button, Card, Col, Result, Row } from "antd";
import { NavLink } from "react-router-dom";


function WithdrawalStatus(props){
  console.log("WithdrawalStatus : "+JSON.stringify(props));



  const showWithdrawalSuccess = () => {
    console.log("showWithdrawalSuccess : "+props.withdrawalSuccess);

    if (props.withdrawalSuccess === null){
      return null;
    } else if (props.withdrawalSuccess){

      return (
        <Row gutter={16} style={{marginTop: "20px"}}>
          <Col span={24}>
            <Result
              status="success"
              title={`Successfully Withdrew $${props.withdrawalAmount} From the Savor Vault!`}
              subTitle={`Transaction id : ${props.withdrawalTransactionNumber}`}
              extra={[
                <>
                  <NavLink to="/Savor1/Dashboard">
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
                    Make new withdrawal
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
              title="Withdrawal Failed"
              subTitle="Not sure what happened"
              extra={
                <>
                  <Button size="large" >
                    Try withdrawing again
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
          {props.withdrawalStatus}
        </Col>
      </Row>

      {showWithdrawalSuccess()}

    </Card>
  )
}

export default WithdrawalStatus;
