import React, { Component } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardBody,
  Media,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Label,
  Button,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

import classnames from "classnames"
import { Link } from "react-router-dom"

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assets: [
        {
          icon: "mdi mdi-bitcoin",
          color: "warning",
          title: "BTC",
          investRate: "1.2601",
          investPrice: "6225.74",
          price: "7525.47",
          loansRate: "0.1512",
          loansPrice: "742.32",
          totalRate: "4.2562",
          totalPrice: "6425.42",
        },
        {
          icon: "mdi mdi-ethereum",
          color: "primary",
          title: "ETH",
          investRate: "0.0814",
          investPrice: "3256.29",
          price: "4235.78",
          loansRate: "0.0253",
          loansPrice: "675.04",
          totalRate: "0.0921",
          totalPrice: "4536.24",
        },
        {
          icon: "mdi mdi-litecoin",
          color: "info",
          title: "LTC",
          investRate: "0.0682",
          investPrice: "2936.14",
          price: "3726.06",
          loansRate: "0.0234",
          loansPrice: "523.17",
          totalRate: "0.0823",
          totalPrice: "3254.23",
        },
        {
          icon: "mdi mdi-bitcoin",
          color: "warning",
          title: "BTC",
          investRate: "1.2601",
          investPrice: "6225.74",
          price: "7525.47",
          loansRate: "0.1512",
          loansPrice: "742.32",
          totalRate: "4.2562",
          totalPrice: "6425.42",
        },
        {
          icon: "mdi mdi-ethereum",
          color: "primary",
          title: "ETH",
          investRate: "0.0814",
          investPrice: "3256.29",
          price: "4235.78",
          loansRate: "0.0253",
          loansPrice: "675.04",
          totalRate: "0.0921",
          totalPrice: "4536.24",
        },
      ],
      formFields: {
        min_max: 70
      },
      isMenu: false,
      modal: false,
      activeTab: 1,
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.togglemodal.bind(this)
    this.toggleTab.bind(this)
  }

  setMin_max(value){
    this.setState(state => {
      state.formFields.min_max = value;
      return state;
    });
  }

  toggleMenu() {
    this.setState(prevState => ({
      isMenu: !prevState.isMenu,
    }))
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
              
              <Col xl="8">
              <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">Farm Pools</h4>

                    <div className="table-responsive">
                      <Table className="table table-nowrap align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Token</th>
                            <th scope="col">Price</th>
                            <th scope="col">Invest</th>
                            <th scope="col">Loans</th>
                            <th scope="col" colSpan="2">
                              Total
                            </th>
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
                                  $ {asset.price}
                                </div>
                              </td>
                              <td>
                                <h5 className="font-size-14 mb-1">
                                  {asset.investRate}
                                </h5>
                                <div className="text-muted">
                                  ${asset.investPrice}
                                </div>
                              </td>
                              <td>
                                <h5 className="font-size-14 mb-1">
                                  {asset.loansRate}
                                </h5>
                                <div className="text-muted">
                                  ${asset.loansPrice}
                                </div>
                              </td>
                              <td>
                                <h5 className="font-size-14 mb-1">
                                  {asset.totalRate}
                                </h5>
                                <div className="text-muted">
                                  ${asset.totalPrice}
                                </div>
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

                  {/* modal */}
                  <Modal
                    isOpen={this.state.modal}
                    role="dialog"
                    size="lg"
                    autoFocus={true}
                    centered={true}
                    id="verificationModal"
                    tabIndex="-1"
                    toggle={this.togglemodal}
                  >
                    <div className="modal-content">
                      <ModalHeader toggle={this.togglemodal}>
                        Verify your Account
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
                                  <Row>
                                    <Col lg="12">
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="kycfirstname-input" className="form-label">
                                          First name
                                        </Label>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          id="kycfirstname-input"
                                          placeholder="Enter First name"
                                        />
                                      </FormGroup>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col lg="12">
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="kycselectcity-input" className="form-label">
                                          City
                                        </Label>
                                        <select
                                          className="form-select"
                                          id="kycselectcity-input"
                                        >
                                          <option>Madrid</option>
                                          <option>Barcelona</option>
                                          <option>Berlin</option>
                                        </select>
                                      </FormGroup>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col lg="12">
                                      <FormGroup>
                                        <InputGroup className="mb-3">
                                          <Label className="input-group-text">
                                            Price
                                          </Label>
                                          <Input type="text" className="form-control" />
                                          <Label className="input-group-text">$</Label>
                                        </InputGroup>
                                      </FormGroup>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col lg={6}>
                                      <div className="p-3">
                                        <label className="form-label">Min-Max</label>
                                        <span className="float-left mt-4">30</span>{" "}
                                        <span className="float-right  mt-4">90</span>
                                        <Slider
                                          value={this.state.formFields.min_max}
                                          min={0}
                                          max={90}
                                          step={0.5}
                                          orientation="horizontal"
                                          onChange={value => {
                                            this.setMin_max(value)
                                          }}
                                        />
                                      </div>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col lg="12">
                                      Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.
                                    </Col>
                                  </Row>
                                </Form>
                              </TabPane>
                              <TabPane tabId={2} id="farm-step-2">
                                <div>
                                  <Form>
                                    <Row>
                                      <Col lg="12">
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="kycemail-input">
                                            Email
                                        </Label>
                                          <Input
                                            type="email"
                                            className="form-control"
                                            id="kycemail-input"
                                            placeholder="Enter Email Address"
                                          />
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                          <Label htmlFor="kycconfirmcode-input">
                                            Confirm code
                                        </Label>
                                          <Input
                                            type="email"
                                            className="form-control"
                                            id="kycconfirmcode-input"
                                            placeholder="Enter Confirm code"
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
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
            
              <Col xl="4">
                <Card>
                  <CardBody className="border-bottom">
                    <Dropdown
                      isOpen={this.state.isMenu}
                      toggle={this.toggleMenu}
                      className="float-end ms-2"
                    >
                      <DropdownToggle tag="a" className="text-muted">
                        <i className="mdi mdi-dots-horizontal font-size-18"/>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem href="#">Action</DropdownItem>
                        <DropdownItem href="#">Another action</DropdownItem>
                        <DropdownItem href="#">Something else</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <div>
                      <div className="mb-4 me-3">
                        <i className="mdi mdi-account-circle text-primary h1"/>
                      </div>

                      <div>
                        <h5 className="">Henry Wells</h5>
                        <p className="text-muted mb-1">henrywells@abc.com</p>
                        <p className="text-muted mb-0">Id no: #SK0234</p>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody className="border-bottom">
                    <div>
                      <Row>
                        <Col sm="6">
                          <div>
                            <p className="text-muted mb-2">Available Balance</p>
                            <h5>$ 9148.00</h5>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="text-sm-end mt-4 mt-sm-0">
                            <p className="text-muted mb-2">Since last month</p>
                            <h5>
                              + $ 215.53{" "}
                              <span className="badge bg-success ms-1 align-bottom">
                                + 1.3 %
                              </span>
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
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
