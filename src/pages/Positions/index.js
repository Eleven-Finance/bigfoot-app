import React, {useState} from "react"
import allPositions from '../../data/allPositions'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
} from "reactstrap"

import { Link } from "react-router-dom"

const Positions = props => {

  const [positions, setpositions] = useState(allPositions);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-playlist-star text-primary h1"/>
                    All Positions
                  </h4>

                  <div className="table-responsive">
                    <Table className="table table-nowrap align-middle text-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Pool</th>
                          <th scope="col">Collateral Value</th>
                          <th scope="col">Borrow Credit</th>
                          <th scope="col">Collateral Credit</th>
                          <th scope="col">Debt Ratio</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((position, key) => (
                          <tr key={key}>
                            <th scope="row">
                              <h5 className="font-size-14 mb-1">
                                #{position.id}
                              </h5>
                            </th>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-xs me-3">
                                  <span
                                    className={
                                      "avatar-title rounded-circle bg-soft bg-" +
                                      position.color +
                                      " text-" +
                                      position.color +
                                      " font-size-18"
                                    }
                                  >
                                    <i className={position.icon}/>
                                  </span>
                                </div>
                                <span>{position.title1}</span>
                                &nbsp;
                                <span>{position.title2}</span>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                $ {position.collateralInDollars}
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {position.borrowCredit} %
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {position.collateralCredit}
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                <span className={
                                  position.debtRatio < 33 ? "text-success" : 
                                  position.debtRatio < 85 ? "text-warning" : "text-danger"
                                }>
                                  {position.debtRatio} %
                                </span>
                              </h5>
                            </td>
                            <td style={{ width: "120px" }}>
                            <Button
                                disabled={ position.debtRatio < 100 }
                                outline={ position.debtRatio < 100 }
                                color={ position.debtRatio < 100 ? "secondary" : "primary" } 
                                onClick={()=>{
                                  console.log("Liquidate")
                                }}
                              >
                                Liquidate
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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
export default Positions;