import React, {useState} from "react"
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

import { Link } from "react-router-dom"

const Earn = props => {

  const [assets, setassets] = useState([
    {
      icon: "mdi mdi-ethereum",
      color: "",
      title: "ibETHv2",
      assetSymbol: "ETH",
      apy: "1.58",
      supply: "17,224.89",
      supplyInDollars: "28,734,381.43",
      borrow: "15,519.46",
      borrowInDollars: "25,889,404.33",
      utilization: "90.10",
      balance: "0.00",
      balanceDiff: "+0.00",
    },
    {
      icon: "mdi mdi-currency-btc",
      color: "",
      title: "ibETHv2",
      assetSymbol: "BTC",
      apy: "1.58",
      supply: "17,224.89",
      supplyInDollars: "28,734,381.43",
      borrow: "15,519.46",
      borrowInDollars: "25,889,404.33",
      utilization: "90.10",
      balance: "0.00",
      balanceDiff: "+0.00",
    },
    {
      icon: "mdi mdi-ethereum",
      color: "",
      title: "ibETHv2",
      assetSymbol: "ETH",
      apy: "1.58",
      supply: "17,224.89",
      supplyInDollars: "28,734,381.43",
      borrow: "15,519.46",
      borrowInDollars: "25,889,404.33",
      utilization: "90.10",
      balance: "0.00",
      balanceDiff: "+0.00",
    },
    {
      icon: "mdi mdi-currency-php",
      color: "",
      title: "ibETHv2",
      assetSymbol: "PHP",
      apy: "1.58",
      supply: "17,224.89",
      supplyInDollars: "28,734,381.43",
      borrow: "15,519.46",
      borrowInDollars: "25,889,404.33",
      utilization: "90.10",
      balance: "0.00",
      balanceDiff: "+0.00",
    },
  ]);

  const [ isModalOpen, setisModalOpen] = useState(false);

  const togglemodal = () => {
    setisModalOpen(!isModalOpen);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-rocket-launch text-primary h1"/>
                    Lending
                  </h4>

                  <div className="table-responsive">
                    <Table className="table table-nowrap align-middle text-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">APY</th>
                          <th scope="col">Total Supply</th>
                          <th scope="col">Total Borrow</th>
                          <th scope="col">Utilization</th>
                          <th scope="col">Balance</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((asset, key) => (
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
                              <div>
                                {asset.apy} %
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {asset.supply} {asset.assetSymbol}
                              </h5>
                              <div className="text-muted">
                                  (${asset.supplyInDollars})
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {asset.borrow} {asset.assetSymbol}
                              </h5>
                              <div className="text-muted">
                                  (${asset.borrowInDollars})
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {asset.utilization} %
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {asset.balance} {asset.assetSymbol}
                              </h5>
                              <div className="text-muted">
                                  ({asset.balanceDiff} {asset.assetSymbol})
                              </div>
                            </td>
                            <td style={{ width: "120px" }}>
                              <div className="mb-2">
                                <Link
                                  to="#"
                                  className="btn btn-primary btn-sm w-xs"
                                  onClick={togglemodal}
                                >
                                  Supply
                                </Link>
                              </div>
                              <div>
                                <Link
                                  to="#"
                                  className="btn btn-primary btn-sm w-xs"
                                  onClick={togglemodal}
                                >
                                  Withdraw
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>

                <Modal
                  isOpen={isModalOpen}
                  role="dialog"
                  size="lg"
                  autoFocus={true}
                  centered={true}
                >
                  <div className="modal-content">
                    <ModalHeader toggle={togglemodal}>
                      Supply
                    </ModalHeader>
                    <ModalBody>
                      <div
                        className="wizard clearfix"
                      >
                        <div className="content clearfix">
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
                              
                            <p>
                              Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.
                            </p>
                          </Form>
                        </div>
                        <div className="actions clearfix">
                          <ul role="menu" aria-label="Pagination">
                            <li
                              className={"previous disabled"}
                            >
                              <Link
                                to="#"
                                onClick={() => {
                                  console.log("cancel...")
                                }}
                              >
                                Cancel
                              </Link>
                            </li>
                            <li
                              className={"next"}
                            >
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
export default Earn;