import React, {useState} from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap"

import myPositions from '../../data/myPositions'
import PositionsTable from "components/BigFoot/PositionsTable"


const MyPositions = props => {

  const [positions, setpositions] = useState(()=>{
    myPositions.sort( (a,b) => parseFloat(b.debtRatio) - parseFloat(a.debtRatio) ); // sort positions by debt in descending order
    return myPositions;
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
                    My Positions
                  </h4>

                  <PositionsTable positions={positions} />
                  
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
export default MyPositions;