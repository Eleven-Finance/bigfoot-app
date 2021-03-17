import React, {useState} from "react"
import PoolsUpperInfo from './PoolsUpperInfo'
import {
  Container,
  Row,
  Button,
  Col,
  Card,
  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Label,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import classnames from "classnames"
import { Link } from "react-router-dom"

const Pools = props => {
  const [ isModalOpen, setisModalOpen] = useState(false);
  const [ activeTab, setactiveTab] = useState(1);

  const togglemodal = () => {
    setisModalOpen(!isModalOpen);
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 2) {
        setactiveTab(tab)
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
                  
          <PoolsUpperInfo />

          <Row>

            <Col sm="12">
              <h2>BigFoot Pools</h2>
            </Col>

            <Col md="4">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-noodles text-primary h1"/>
                    Noodleswap ibETHv2/BIG
                  </h4>
                  <p className="text-muted">Accepting ibETHv2, BIGFOOT</p>

                  <div className="text-center mt-4 mb-3">
                    <i className="mdi mdi-ethereum text-primary h1"/>
                    <i className="mdi mdi-foot-print text-primary h1"/>
                  </div>
                  <Row>
                    <Col sm="12" className="d-flex justify-content-between align-items-end">
                      <span className="text-muted mb-2">APY</span>
                      <span className="pool-apy-value">0.00%</span>
                    </Col>
                    <Col sm="12">
                    </Col>
                  </Row>

                  <Row>
                    <Col sm="12" className="mb-2">
                      <Button
                        block 
                        color="primary" 
                        onClick={togglemodal}
                      >
                        Supply 1x & Stake
                      </Button>
                    </Col>
                    <Col sm="12">
                      <Button
                        block 
                        outline
                        onClick={()=>{
                          console.log("Stake")
                        }}
                      >
                        Stake
                      </Button>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Col>

            <Col md="4">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-food-apple text-primary h1"/>
                    Appleswap ibETHv2/BIG
                  </h4>
                  <p className="text-muted">Accepting ibETHv2, BIGFOOT</p>

                  <div className="text-center mt-4 mb-3">
                    <i className="mdi mdi-ethereum text-primary h1"/>
                    <i className="mdi mdi-foot-print text-primary h1"/>
                  </div>
                  <Row>
                    <Col sm="12" className="d-flex justify-content-between align-items-end">
                      <span className="text-muted mb-2">APY</span>
                      <span className="pool-apy-value">0.00%</span>
                    </Col>
                    <Col sm="12">
                    </Col>
                  </Row>

                  <Row>
                    <Col sm="12" className="mb-2">
                      <Button
                        block 
                        color="primary" 
                        onClick={togglemodal}
                      >
                        Supply 1x & Stake
                      </Button>
                    </Col>
                    <Col sm="12">
                      <Button
                        block 
                        outline
                        onClick={()=>{
                          console.log("Stake")
                        }}
                      >
                        Stake
                      </Button>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Col>

          </Row>

          <Modal
            isOpen={isModalOpen}
            role="dialog"
            size="lg"
            autoFocus={true}
            centered={true}
            tabIndex="-1"
            toggle={togglemodal}
          >
            <div className="modal-content">
              <ModalHeader toggle={togglemodal}>
                Farm
              </ModalHeader>
              <ModalBody>
                <div
                  id="kyc-verify-wizard"
                  className="wizard clearfix"
                >
                  <div className="steps clearfix">
                    <ul>
                      <NavItem
                        className={classnames({
                          current: activeTab === 1,
                        })}>
                        <NavLink
                          className={classnames({
                            active: activeTab === 1,
                          })}
                          onClick={() => {
                            toggleTab(1)
                          }}
                        >
                          <span className="number">1.</span>
                          Supply tokens
                        </NavLink>
                      </NavItem>
                        <NavItem
                          className={classnames({
                            current: activeTab === 2,
                          })}>
                          <NavLink
                            className={classnames({
                              active: activeTab === 2,
                            })}
                            onClick={() => {
                              toggleTab(2)
                            }}
                          >
                            <span className="number">2.</span>
                            Confirm strategy
                        </NavLink>
                      </NavItem>
                    </ul>
                  </div>
                  <div className="content clearfix">
                    <TabContent
                      activeTab={activeTab}
                      className="twitter-bs-wizard-tab-content"
                    >
                      <TabPane tabId={1} id="step-1">
                        <Form>
                          <p>I'd like to supply...</p>
                              
                          <FormGroup>
                            <Row>
                              <Col sm="6" lg="8">
                                <InputGroup className="mb-3">
                                  <Label className="input-group-text">
                                    <i className="mdi mdi-bitcoin" />
                                    BTC
                                  </Label>
                                  <Input type="number" className="form-control" value={"0"} />
                                </InputGroup>
                              </Col>
                              <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                                <span className="me-3">
                                  Balance: 0.0000
                                </span>
                                <Button 
                                  outline
                                  onClick={()=>{
                                    console.log("set max.")
                                  }}
                                >
                                  MAX
                                </Button>
                              </Col>
                            </Row>
                          </FormGroup>
                          
                          <FormGroup>
                            <Row>
                              <Col sm="6" lg="8">
                                <InputGroup className="mb-3">
                                  <Label className="input-group-text">
                                    <i className="mdi mdi-ethereum" />
                                    ETH
                                  </Label>
                                  <Input type="number" className="form-control" value={"0"} />
                                </InputGroup>
                              </Col>
                              <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                                <span className="me-3">
                                  Balance: 0.0000
                                </span>
                                <Button 
                                  outline
                                  onClick={()=>{
                                    console.log("set max.")
                                  }}
                                >
                                  MAX
                                </Button>
                              </Col>
                            </Row>
                          </FormGroup>
                        
                          <p>Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.</p>
                        </Form>
                      </TabPane>
                      <TabPane tabId={2} id="step-2">
                        <h5 className="font-size-14 mb-3">
                          Step2 Summary
                        </h5>
                      </TabPane>
                    </TabContent>
                  </div>
                  <div className="actions clearfix">
                    <ul role="menu" aria-label="Pagination">
                      <li
                        className={
                          activeTab === 1
                            ? "previous disabled"
                            : "previous"
                        }
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            toggleTab(activeTab - 1)
                          }}
                        >
                          Previous
                        </Link>
                      </li>
                      <li
                        className={
                          activeTab === 3
                            ? "next disabled"
                            : "next"
                        }
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            toggleTab(activeTab + 1)
                          }}
                        >
                          Next
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </ModalBody>
            </div>
          </Modal>

        </Container>
      </div>
    </React.Fragment>
  )
}
export default Pools;