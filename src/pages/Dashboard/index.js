import React, { Component } from "react"
import farmPools from '../../data/farmPools'
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
  Label,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

import { Link } from "react-router-dom"

import Formatter from '../../helpers/bigfoot/Formatter'
import "./Dashboard.scss"

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pools: farmPools,
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
      tvl: '',
    }
    this.togglemodal.bind(this)
  }

  componentDidMount(){
    fetch( process.env.REACT_APP_API_URL )
      .then( res => res.json() )
      .then( json => {
        this.setState({
          tvl: json.totalvaluelocked
        });
      })
      .catch( error => console.log('Error fetching data from api. ', error) )
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
      
      newState.modal = true;
    }

    this.setState(newState);
  }

  renderIcon(icon, color) {
    return (
      <span className={ "avatar-title rounded-circle bg-transparent font-size-18" } >
        <img src={icon.default} />
      </span>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div id="Dashboard" className="page-content">
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
                        <p className="total-value text-center">$ { Formatter.getFormattedTvl(this.state.tvl) }</p>
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
                        <p className="mb-0">Total Collateral</p>
                      </Col>
                      <Col sm="6" className="text-end">
                        <p>$ 0.00</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <p className="mb-0">Total Borrow</p>
                      </Col>
                      <Col sm="6" className="text-end">
                        <p>$ 0.00</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <p className="mb-0">Active Positions</p>
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
                          <p className="mb-2">Total Collateral</p>
                          <h5>$ 0.00</h5>
                        </div>
                      </Col>
                      <Col sm="12" className="mb-0">
                        <div>
                          <p className="mb-2">Total Borrow</p>
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
                    id="dashboardModal"
                    isOpen={this.state.modal}
                    role="dialog"
                    size="lg"
                    autoFocus={true}
                    centered={true}
                    toggle={this.togglemodal}
                  >
                    <div className="modal-content">
                      <ModalHeader toggle={this.togglemodal}>
                        Farm: {this.state.formData.poolTitle}
                      </ModalHeader>
                      <ModalBody>
                        <div
                          className="wizard clearfix"
                        >
                          <div className="content clearfix">

                            <Form>

                              <div className="mb-3">
                                <p>Choose how much you want to supply:</p>
                                
                                {
                                  this.state.formData.poolTitle &&
                                  this.state.pools.find( pool => pool.title === this.state.formData.poolTitle ).currencies.map( (currency, index) => {
                                    if(index>0) return ''; // note: currenly rendering an input only for the first currency (comment this line to render an input for each currency)
                                    return (
                                      <FormGroup key={currency.code}>
                                        <Row>
                                          <Col sm="6" lg="8">
                                            <InputGroup className="mb-3">
                                              <Label className="input-group-text">
                                                <span className="me-2">
                                                  {this.renderIcon(currency.icon)}
                                                </span>
                                                {currency.code}
                                              </Label>
                                              <Input 
                                                type="number" 
                                                className="form-control" 
                                                min="0"
                                                step="0.000001"
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
                                              color="primary"
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
                              </div>
                              <div className="mb-3">
                                <p>Choose how much you 'd like to borrow:</p>
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
                              </div>
                              <p>
                                Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.
                              </p>

                            </Form>
                          </div>
                          <div className="actions clearfix">
                            <ul role="menu" aria-label="Pagination">
                              <li className={"next"} >
                                <Link
                                  to="#"
                                  onClick={() => {
                                    console.log("confirm...")
                                  }}
                                >
                                  Confirm
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
