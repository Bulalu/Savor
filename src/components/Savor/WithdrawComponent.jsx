import React from "react";
import { Button, Card, InputNumber } from "antd";


const styles = {
  card: {
    width: "430px",
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
  },
  input: {
    padding: "0",
    fontWeight: "500",
    fontSize: "23px",
    display: "block",
    width: "100%",
  },
  priceSwap: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
    color: "#434343",
    marginTop: "8px",
    padding: "0 10px",
  },
};

class Stake extends React.Component {

  render() {
    return (
      <>
        <Card style={styles.card} bodyStyle={{ padding: "18px" }}>
          <Card
            style={{ borderRadius: "1rem" }}
            bodyStyle={{ padding: "0.8rem" }}
          >
            <div
              style={{ marginBottom: "5px", fontSize: "14px", color: "#434343" }}
            >
              Deposit
            </div>
            <div
              style={{
                display: "flex",
                flexFlow: "row nowrap",
              }}
            >
              <div>
                <InputNumber
                  bordered={false}
                  placeholder="0.00"
                  style={{ ...styles.input, marginLeft: "-10px" }}
                  //onChange={setFromAmount}
                  //value={fromAmount}
                />
              </div>
              <Button
                style={{
                  height: "fit-content",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "0.6rem",
                  padding: "5px 10px",
                  fontWeight: "500",
                  fontSize: "17px",
                  gap: "7px",
                  border: "none",
                }}
                //onClick={() => setFromModalActive(true)}
              >
               button
              </Button>
            </div>
          </Card>

          <Button
            type="primary"
            size="large"
            style={{
              width: "100%",
              marginTop: "15px",
              borderRadius: "0.6rem",
              height: "50px",
            }}
            //onClick={() => trySwap(currentTrade)}
            //disabled={!ButtonState.isActive}
          >
            Deposit
          </Button>
        </Card>
      </>
    );
  }
}

export default Stake;
