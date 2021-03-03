import React, { Component } from "react"
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

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

import classnames from "classnames"
import { Link } from "react-router-dom"

import '../../pages/Dashboard/Dashboard.scss'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assets: [
        {
          icon: "mdi mdi-bitcoin",
          color: "warning",
          title: "BTC",
          percentage: "61.66",
          percentageOut: "25.53",
          typeTitle: "Liquidity Providing",
          typeDetails: "Uniswap UNI/ETH",
          details: [
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          icon: "mdi mdi-ethereum",
          color: "primary",
          title: "ETH",
          percentage: "114.82",
          percentageOut: "51.81",
          typeTitle: "Liquidity Providing",
          typeDetails: "Uniswap UNI/ETH",
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          icon: "mdi mdi-litecoin",
          color: "info",
          title: "LTC",
          percentage: "244.42",
          percentageOut: "91.19",
          typeTitle: "Liquidity Providing",
          typeDetails: "Uniswap UNI/ETH",
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          icon: "mdi mdi-bitcoin",
          color: "warning",
          title: "BTC",
          percentage: "162.50",
          percentageOut: "16.42 ",
          typeTitle: "Liquidity Providing",
          typeDetails: "Uniswap UNI/ETH",
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          icon: "mdi mdi-ethereum",
          color: "primary",
          title: "ETH",
          percentage: "68.12",
          percentageOut: "42.10",
          typeTitle: "Liquidity Providing",
          typeDetails: "Uniswap UNI/ETH",
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
      ],
      formFields: {
        min_max: 2
      },
      modal: false,
      activeTab: 1,
    }
    this.togglemodal.bind(this)
    this.toggleTab.bind(this)
  }

  setMin_max(value){
    this.setState(state => {
      state.formFields.min_max = value;
      return state;
    });
  }

  togglemodal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 3) {
        this.setState({
          activeTab: tab,
        })
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Row>
              <Col md="4">
                <Card>
                  <CardBody>
                    <h4 className="card-title">
                      <i className="mdi mdi-lock text-primary h1"/>
                      Total Value Locked
                    </h4>
                    <Row>
                      <Col sm="12">
                        <p id="total-value">$ 0.00</p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col md="4">
              <Card>
                <CardBody>
                    <h4 className="card-title">
                      <i className="mdi mdi-earth text-primary h1"/>
                      Global
                    </h4>
                    <Row>
                      <Col sm="6">
                        <p className="text-muted mb-2">Total Collateral</p>
                      </Col>
                      <Col sm="6" className="text-end">
                        <p>$ 0.00</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <p className="text-muted mb-2">Total Borrow</p>
                      </Col>
                      <Col sm="6" className="text-end">
                        <p>$ 0.00</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <p className="text-muted mb-2">Active Positions</p>
                      </Col>
                      <Col sm="6" className="text-end">
                        <p>100 Positions</p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
                            
              <Col md="4">
                <Card>
                  <CardBody>
                    <h4 className="card-title">
                      <i className="mdi mdi-account-circle text-primary h1"/>
                      Your info
                    </h4>

                    <Row>
                      <Col sm="12">
                        <div>
                          <p className="text-muted mb-2">Total Collateral</p>
                          <h5>$ 0.00</h5>
                        </div>
                      </Col>
                      <Col sm="12">
                        <div>
                          <p className="text-muted mb-2">Total Borrow</p>
                          <h5>$ 0.00</h5>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <h4 className="card-title">
                      <i className="mdi mdi-warehouse text-primary h1"/>
                      Farm Pools
                    </h4>

                    <div className="table-responsive">
                      <Table className="table table-nowrap align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Pair</th>
                            <th scope="col">Type</th>
                            <th scope="col">Percentage</th>
                            <th scope="col" colSpan="2">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.assets.map((asset, key) => (
                            <tr key={key}>
                              <th scope="row">
                                <div className="d-flex align-items-center">
                                <div className="avatar-xs me-3">
                                    <span
                                      className={
                                        "avatar-title rounded-circle bg-soft bg-" +
                                        asset.color +
                                        " text-" +
                                        asset.color +
                                        " font-size-18"
                                      }
                                    >
                                      <i className={asset.icon}/>
                                    </span>
                                  </div>
                                  <span>{asset.title}</span>
                                </div>
                              </th>
                              <td>
                                <div className="text-muted">
                                  {asset.typeTitle}
                                </div>
                                <h5 className="font-size-14 mb-1">
                                  {asset.typeDetails}
                                </h5>
                              </td>
                              <td>
                                <h5 className="font-size-20 mb-1">
                                  {asset.percentage} %
                                </h5>
                                <div className="text-muted">
                                  <del>
                                    {asset.percentageOut} %
                                  </del>
                                </div>
                              </td>
                              <td>

                                { 
                                  asset.details.map( element => {
                                    return(
                                      <Row>
                                        <Col sm="6">
                                          {element.title}
                                        </Col>
                                        <Col sm="6" className="text-end">
                                          {element.percentage} %
                                        </Col>
                                      </Row>
                                    )
                                  })
                                }
                              </td>
                              <td style={{ width: "120px" }}>
                                <Link
                                  to="#"
                                  className="btn btn-primary btn-sm w-xs"
                                  onClick={this.togglemodal}
                                >
                                  Farm
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>

                  <Modal
                    isOpen={this.state.modal}
                    role="dialog"
                    size="lg"
                    autoFocus={true}
                    centered={true}
                    tabIndex="-1"
                    toggle={this.togglemodal}
                  >
                    <div className="modal-content">
                      <ModalHeader toggle={this.togglemodal}>
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
                                  current: this.state.activeTab === 1,
                                })}>
                                <NavLink
                                  className={classnames({
                                    active: this.state.activeTab === 1,
                                  })}
                                  onClick={() => {
                                    this.toggleTab(1)
                                  }}
                                >
                                  <span className="number">1.</span>
                                Supply tokens
                              </NavLink>
                              </NavItem>
                              <NavItem
                                className={classnames({
                                  current: this.state.activeTab === 2,
                                })}>
                                <NavLink
                                  className={classnames({
                                    active: this.state.activeTab === 2,
                                  })}
                                  onClick={() => {
                                    this.toggleTab(2)
                                  }}
                                >
                                  <span className="number">2.</span>
                                Borrow tokens
                              </NavLink>
                              </NavItem>
                              <NavItem
                                className={classnames({
                                  current: this.state.activeTab === 3,
                                })}>
                                <NavLink
                                  className={classnames({
                                    active: this.state.activeTab === 3,
                                  })}
                                  onClick={() => {
                                    this.toggleTab(3)
                                  }}
                                >
                                  <span className="number">3.</span>
                                Confirm strategy
                              </NavLink>
                              </NavItem>
                            </ul>
                          </div>
                          <div className="content clearfix">
                            <TabContent
                              activeTab={this.state.activeTab}
                              className="twitter-bs-wizard-tab-content"
                            >
                              <TabPane tabId={1} id="farm-step-1">
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
                              <TabPane tabId={2} id="farm-step-2">
                                <div>
                                  <Form>
                                    <p>Choose how much you'd like to borrow...</p>
                                    <Slider
                                      value={this.state.formFields.min_max}
                                      min={1.5}
                                      max={3}
                                      step={0.5}
                                      labels={{ 1.5: "1.5", 2: "2.0", 2.5: "2.5", 3: "3.0" }}
                                      orientation="horizontal"
                                      onChange={value => {
                                        this.setMin_max(value)
                                      }}
                                    />
                                  </Form>
                                </div>
                              </TabPane>
                              <TabPane tabId={3} id="farm-step-3">
                                <h5 className="font-size-14 mb-3">
                                  Details for step 3
                                </h5>
                              </TabPane>
                            </TabContent>
                          </div>
                          <div className="actions clearfix">
                            <ul role="menu" aria-label="Pagination">
                              <li
                                className={
                                  this.state.activeTab === 1
                                    ? "previous disabled"
                                    : "previous"
                                }
                              >
                                <Link
                                  to="#"
                                  onClick={() => {
                                    this.toggleTab(this.state.activeTab - 1)
                                  }}
                                >
                                  Previous
                                </Link>
                              </li>
                              <li
                                className={
                                  this.state.activeTab === 3
                                    ? "next disabled"
                                    : "next"
                                }
                              >
                                <Link
                                  to="#"
                                  onClick={() => {
                                    this.toggleTab(this.state.activeTab + 1)
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
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

export default Dashboard;
