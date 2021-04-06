import React, {useState} from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
} from "reactstrap"

import allPositions from '../../data/allPositions'
import { Cake } from '../../assets/images/bigfoot/icons-assets/_index'
import { Bnb } from '../../assets/images/bigfoot/icons-coins/_index'


const renderIcon = (positionTitle) => {
  let icon;

  switch(positionTitle){
    case '11CAKE':
      icon = Cake;
      break;
    case '11CAKEBNB':
      icon = Bnb;
      break;
  }

  return (
    <span className={"avatar-title rounded-circle bg-transparent font-size-18 me-2"} >
      <img src={icon?.default} />
    </span>
  );
}

const Positions = props => {

  const [positions, setpositions] = useState(()=>{
    allPositions.sort( (a,b) => parseFloat(b.debtRatio) - parseFloat(a.debtRatio) ); // sort positions by debt in descending order
    return allPositions;
  });

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
                          <th scope="col" className="text-start">Farm Pool</th>
                          <th scope="col">Collateral Value</th>
                          <th scope="col">Borrow Credit</th>
                          <th scope="col">Collateral Credit</th>
                          <th scope="col">Debt Ratio</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map( position => (
                          <tr key={position.id}>
                            <th scope="row">
                              <h5 className="font-size-14 mb-1">
                                #{position.id}
                              </h5>
                            </th>
                            <td>
                              <div className="d-flex align-items-center">
                                { renderIcon(position.title) }
                                <span>{position.title}</span>
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

                                // temporal values (remove once functionality to liquidate is ready)
                                disabled={ true }
                                style={ {color: position.debtRatio < 100 ? '' : "#213c46" }}
                            
                                
                                // disabled={ position.debtRatio < 100 }
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