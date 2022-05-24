import React from "react";
import { Button, Card, Col, Result, Row } from "antd";
import { getEllipsisTxt } from "../../helpers/formatters";


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
              subTitle={`Transaction id : ${getEllipsisTxt(props.withdrawalTransactionNumber, 6)}`}
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
              subTitle="Our administrator has been notified of the error"
              extra={
                <>
                  <Button size="small" >
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
