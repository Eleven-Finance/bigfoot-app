import React, {useState} from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap"

import allPositions from '../../data/allPositions'
import PositionsTable from "components/BigFoot/PositionsTable"


const AllPositions = props => {

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
                    <i className="mdi mdi-playlist-play text-primary h1"/>
                    All Positions
                  </h4>

                  <PositionsTable positions={positions} showAll />
                  
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
export default AllPositions;