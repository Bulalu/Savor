import React from "react";
import { Row, Col } from "antd";
import Text from "antd/lib/typography/Text";

function Footer() {
  return (
    <Footer style={{ textAlign: "center" }}>
      <footer id="footer" className="dark">
        <div className="footer-wrap">
          <Row>
            <Col md={6} sm={24} xs={24}>
              <div className="footer-center">
                <h2>Ant Design</h2>
                <div>
                  <a href="http://pro.ant.design">Ant Design Pro</a>
                </div>
                <div>
                  <a href="http://mobile.ant.design">Ant Design Mobile</a>
                </div>
                <div>
                  <a href="http://ng.ant.design">NG-ZORRO</a>
                  <span> - </span>
                  Ant Design of Angular
                </div>
              </div>
            </Col>
            <Col md={6} sm={24} xs={24}>
              <div className="footer-center">
                <h1>Hello</h1>
              </div>
            </Col>
            <Col md={6} sm={24} xs={24}>
              <div className="footer-center">
                <h1>hello</h1>
              </div>
            </Col>
            <Col md={6} sm={24} xs={24}>
              <div className="footer-center">
                <h1>hh2h</h1>
              </div>
            </Col>
          </Row>
        </div>
        <Row className="bottom-bar">
          <Col md={4} sm={24} />
          <Col md={20} sm={24}>
            <Text style={{ display: "block" }}>⭐footer bottom⭐</Text>
          </Col>
        </Row>
      </footer>
    </Footer>
  );
}

export default Footer;
