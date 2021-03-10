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
      pools: [
        {
          title: "Bitswap BTC/ETH",
          color: "warning",
          type: "Liquidity Providing",
          percentage: "61.66",
          percentageOut: "25.53",
          currencies: [
            {
              code: "BTC",
              icon: "mdi mdi-bitcoin"
            },
            {
              code: "ETH",
              icon: "mdi mdi-ethereum"
            },
          ],
          details: [
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          title: "NoodleSwap NOO/ETH",
          color: "primary",
          type: "Liquidity Providing",
          percentage: "114.82",
          percentageOut: "51.81",
          currencies: [
            {
              code: "NOO",
              icon: "mdi mdi-noodles"
            },
            {
              code: "ETH",
              icon: "mdi mdi-ethereum"
            },
          ],
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          title: "Liteswap LIT/ETH",
          color: "info",
          type: "Liquidity Providing",
          percentage: "244.42",
          percentageOut: "91.19",
          currencies: [
            {
              code: "LIT",
              icon: "mdi mdi-litecoin"
            },
            {
              code: "ETH",
              icon: "mdi mdi-ethereum"
            },
          ],
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          title: "Ethswap ETH/BTC/LIT",
          customIcon: "mdi mdi-numeric-3-circle",
          color: "warning",
          type: "Liquidity Providing",
          percentage: "162.50",
          percentageOut: "16.42 ",
          currencies: [
            {
              code: "ETH",
              icon: "mdi mdi-ethereum"
            },
            {
              code: "BTC",
              icon: "mdi mdi-bitcoin"
            },
            {
              code: "LIT",
              icon: "mdi mdi-litecoin"
            },
          ],
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
        {
          title: "Multiswap ETH/NOO/LIT",
          customIcon: "mdi mdi-airballoon",
          color: "warning",
          type: "Liquidity Providing",
          percentage: "68.12",
          percentageOut: "42.10",
          currencies: [
            {
              code: "ETH",
              icon: "mdi mdi-ethereum"
            },
            {
              code: "NOO",
              icon: "mdi mdi-noodles"
            },
            {
              code: "LIT",
              icon: "mdi mdi-litecoin"
            },
          ],
          details: [
            { title: "Yield Farming", percentage: "83.95" },
            { title: "Trading Fee", percentage: "51.68 " },
            { title: "Alpha APY", percentage: "25.96" },
            { title: "Borrow APY", percentage: "-16.13" },
          ]
        },
      ],
      formData: {
        poolTitle: '',
        currencySupply: {
          // currencyCodeA: amountA,
          // currencyCodeB: amountB,
          // ...
        },
        borrowFactor: 2
      },
      modal: false,
      activeTab: 1,
    }
    this.togglemodal.bind(this)
    this.toggleTab.bind(this)
  }

  setBorrowFactor(value){
    this.setState(state => {
      state.formData.borrowFactor = value;
      return state;
    });
  }

  updateCurrencySupply(currencyCode, value) {
    let newFormData = JSON.parse(JSON.stringify(this.state.formData));
    newFormData.currencySupply[currencyCode] = value;
    this.setState({
      formData: newFormData
    });
  }

  togglemodal = (poolTitle) => {

    let newState = JSON.parse(JSON.stringify(this.state));
    
    if(this.state.modal) { //reset formData and close
      newState.formData = {
        poolTitle: '',
        currencySupply: {},
        borrowFactor: 2
      };
      newState.modal = false;
    } else { //initialize formData and open
      
      newState.formData.poolTitle = poolTitle;

      // initialize currencySupply as { currencyCodeA: 0, currencyCodeB: 0, ...}
      const poolCurrencies = this.state.pools.find( pool => pool.title===poolTitle).currencies;
      newState.formData.currencySupply = Object.fromEntries(
        poolCurrencies.map(currency => [currency.code, 0])
      );
      
      newState.activeTab = 1;
      newState.modal = true;
    }

    this.setState(newState);
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

  renderIcon(icon, color) {
    return (
      <span className={ "avatar-title rounded-circle bg-soft bg-"+color + " text-"+color + " font-size-18" } >
        <i className={icon}/>
      </span>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="Dashboard page-content">
          <Container fluid>
            <Row className="equal-height">
              <Col md="4">
                <Card>
                  <CardBody>
                    <h4 className="card-title">
                      <i className="mdi mdi-lock text-primary h1"/>
                      Total Value Locked
                    </h4>
                    <Row>
                      <Col sm="12">
                        <p className="amount-total-value">$ 0.00</p>
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
                        <p className="text-muted mb-0">Total Collateral</p>
                      </Col>
                      <Col sm="6" className="text-end">
                        <p>$ 0.00</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <p className="text-muted mb-0">Total Borrow</p>
                      </Col>
                      <Col sm="6" className="text-end">
                        <p>$ 0.00</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <p className="text-muted mb-0">Active Positions</p>
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
                      <i className="mdi mdi-information-variant text-primary h1" />
                      Your info
                    </h4>

                    <Row>
                      <Col sm="12">
                        <div>
                          <p className="text-muted mb-2">Total Collateral</p>
                          <h5>$ 0.00</h5>
                        </div>
                      </Col>
                      <Col sm="12" className="mb-0">
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
                      <i className="mdi mdi-tractor-variant text-primary h1"/>
                      Farm Pools
                    </h4>

                    <div className="table-responsive">
                      <Table className="table table-nowrap align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col" className="text-center">Pair</th>
                            <th scope="col">Type</th>
                            <th scope="col">Percentage</th>
                            <th scope="col" colSpan="2">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.pools.map( (pool, index) => (
                            <tr key={index}>
                              <th scope="row">
                                <div className="d-flex align-items-center">
                                  <div className="avatar-xs avatar-multi">
                                      { 
                                        pool.customIcon ? 
                                        this.renderIcon(pool.customIcon, pool.color) : 
                                        pool.currencies.map( (currency, index) => {
                                          return (
                                            <React.Fragment key={index}>
                                              {this.renderIcon(currency.icon, pool.color)}
                                            </React.Fragment>
                                          )
                                        })
                                      }
                                  </div>
                                </div>
                              </th>
                              <td>
                                <div className="text-muted">
                                  {pool.type}
                                </div>
                                <h5 className="font-size-14 mb-1">
                                  {pool.title}
                                </h5>
                              </td>
                              <td>
                                <h5 className="font-size-20 mb-1">
                                  {pool.percentage} %
                                </h5>
                                <div className="text-muted">
                                  <del>
                                    {pool.percentageOut} %
                                  </del>
                                </div>
                              </td>
                              <td>

                                { 
                                  pool.details.map( (element, index) => {
                                    return(
                                      <Row key={index}>
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
                                  onClick={ () => this.togglemodal(pool.title)}
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
                        Farm: {this.state.formData.poolTitle}
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
                                  
                                  {
                                    this.state.formData.poolTitle &&
                                    this.state.pools.find( pool => pool.title === this.state.formData.poolTitle ).currencies.map( currency => {
                                      return (
                                        <FormGroup key={currency.code}>
                                          <Row>
                                            <Col sm="6" lg="8">
                                              <InputGroup className="mb-3">
                                                <Label className="input-group-text">
                                                  <i className={currency.icon} />
                                                  {currency.code}
                                                </Label>
                                                <Input 
                                                  type="number" 
                                                  className="form-control" 
                                                  min="0"
                                                  step="0.1"
                                                  value={this.state.formData.currencySupply?.[currency.code] ?? 0}
                                                  onChange={ (e) => this.updateCurrencySupply(currency.code, e.target.value)}
                                                />
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
                                      )
                                    })
                                  }
                                
                                  <p>Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.</p>
                                </Form>
                              </TabPane>
                              <TabPane tabId={2} id="farm-step-2">
                                <div>
                                  <Form>
                                    <p>Choose how much you'd like to borrow...</p>
                                    <Slider
                                      value={this.state.formData.borrowFactor}
                                      min={1.5}
                                      max={3}
                                      step={0.5}
                                      labels={{ 1.5: "1.5", 2: "2.0", 2.5: "2.5", 3: "3.0" }}
                                      orientation="horizontal"
                                      onChange={value => {
                                        this.setBorrowFactor(value)
                                      }}
                                    />
                                  </Form>
                                </div>
                              </TabPane>
                              <TabPane tabId={3} id="farm-step-3" className="font-size-16">
                                <p className="mt-3">
                                  You will supply: 
                                </p>
                                <ul>
                                  {
                                    Object.keys(this.state.formData.currencySupply).map(currency => {
                                      return <li key={currency} className="mt-3">{currency}: {this.state.formData.currencySupply[currency]}</li>
                                    })
                                  }
                                </ul>
                                <p className="font-size-16 mt-3 mb-3">
                                  Borrow factor: {this.state.formData.borrowFactor} 
                                </p>
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
