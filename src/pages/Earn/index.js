import React, {useState} from "react"
import lendingOptions from '../../data/lendingOptions'
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

  const [options, setOptions] = useState(lendingOptions);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    option: '', // lending option chosen by the user (defined by option.title)
    action: '', // supply,withdraw
    amount: 0,
  });

  const togglemodal = (option = '', action = '') => {
    setFormData({
      option: option,
      action: action,
      amount: 0
    });
    setisModalOpen(!isModalOpen);
  }

  const updateAmount = (value) => {
    let newFormData = {...formData};
    newFormData.amount = value
    setFormData(newFormData);
  }

  const renderFormContent = () => {

    const selectedOption = options.find( option => option.title === formData.option);
    const {title = '', currency = '', icon = ''} = selectedOption || {};
    
    if (formData.action === 'supply') {
      return (
        <React.Fragment>
          <p>I'd like to supply...</p>
          <FormGroup>
            <Row>
              <Col sm="6" lg="8">
                <InputGroup className="mb-3">
                  <Label className="input-group-text">
                    <div className="avatar-xs me-3">
                      <span className={"avatar-title rounded-circle bg-transparent"} >
                        <img src={icon.default} />
                      </span>
                    </div>
                    {currency}
                  </Label>
                  <Input 
                    type="number" 
                    className="form-control" 
                    min={0}
                    step={0.01}
                    value={formData.amount} 
                    onChange={(e) => updateAmount(e.target.value)}/>
                </InputGroup>
              </Col>
              <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                <span className="me-3">
                  Balance: 0.0000
              </span>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    console.log("set max.")
                  }}
                >
                  MAX
              </Button>
              </Col>
            </Row>
          </FormGroup>
        </React.Fragment>
      );
    } else if (formData.action === 'withdraw') {
      return (
        <React.Fragment>
          <p>I'd like to withdraw...</p>
          <FormGroup>
            <Row>
              <Col sm="6" lg="8">
                <InputGroup className="mb-3">
                  <Label className="input-group-text">
                    <div className="avatar-xs me-3">
                      <span className={"avatar-title rounded-circle bg-transparent"} >
                        <img src={icon.default} />
                      </span>
                    </div>
                    {title}
                  </Label>
                  <Input 
                    type="number" 
                    className="form-control" 
                    min={0}
                    step={0.01}
                    value={formData.amount}
                    onChange={(e) => updateAmount(e.target.value)}/>
                </InputGroup>
              </Col>
              <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                <span className="me-3">
                  Balance: 0.0000
              </span>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    console.log("set max.")
                  }}
                >
                  MAX
                </Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="12">
                <p>
                  You will get {currency}: xxx
                </p>
              </Col>
            </Row>
          </FormGroup>
        </React.Fragment>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-information-variant text-primary h1" />
                    Your info
                  </h4>

                  <Row className="text-center mt-3">
                    <Col sm="6">
                      <div>
                        <p className="mb-2">Supply Balance</p>
                        <p className="total-value">$ 0.00</p>
                      </div>
                    </Col>
                    <Col sm="6" className="mb-0">
                      <div>
                        <p className="mb-2">Net APY</p>
                        <p className="total-value">0.00 %</p>
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
                        {options.map((option, key) => (
                          <tr key={key}>
                            <th scope="row">
                              <div className="d-flex align-items-center">
                                <div className="avatar-xs me-3">
                                  <span className={"avatar-title rounded-circle bg-transparent"} >
                                    <img src={option.icon.default} />
                                  </span>
                                </div>
                                <span>{option.title}</span>
                              </div>
                            </th>
                            <td>
                              <div>
                                {option.apy} %
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.supply} {option.currency}
                              </h5>
                              <div className="text-muted">
                                  (${option.supplyInDollars})
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.borrow} {option.currency}
                              </h5>
                              <div className="text-muted">
                                  (${option.borrowInDollars})
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.utilization} %
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.balance} {option.currency}
                              </h5>
                              <div className="text-muted">
                                  ({option.balanceDiff} {option.currency})
                              </div>
                            </td>
                            <td style={{ width: "120px" }}>
                              <div className="mb-2">
                                <Link
                                  to="#"
                                  className="btn btn-primary btn-sm w-xs"
                                  onClick={() => togglemodal(option.title, 'supply')}
                                >
                                  Supply
                                </Link>
                              </div>
                              <div>
                                <Link
                                  to="#"
                                  className="btn btn-primary btn-sm w-xs"
                                  onClick={() => togglemodal(option.title, 'withdraw')}
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
                  toggle={() => togglemodal()}
                >
                  <div className="modal-content">
                    <ModalHeader toggle={() => togglemodal()}>
                      <span className="text-capitalize">
                        {formData.action}: 
                      </span>
                      &nbsp;
                      {formData.option}
                    </ModalHeader>
                    <ModalBody>
                      <div
                        className="wizard clearfix"
                      >
                        <div className="content clearfix">
                          <Form>
                            {renderFormContent()}
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