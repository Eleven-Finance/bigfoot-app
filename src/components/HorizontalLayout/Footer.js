import React from "react"
import { Container, Row, Col } from "reactstrap"

import {ReactComponent as IconMedium} from '../../assets/images/bigfoot/icons-social/medium.svg'

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col xs={12} className="text-center mb-3">
              <div id="social">
                <a target="_blank" href="https://twitter.com/elevenfinance">
                  <i className="mdi mdi-twitter" />
                </a>
                <a target="_blank" href="https://t.me/elevenfinance">
                  <i className="mdi mdi-telegram" />
                </a>
                <a target="_blank" href="https://elevenfinance.medium.com/">
                  <IconMedium />
                </a>
              </div>
              <div>
                {new Date().getFullYear()}, BigFoot
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
