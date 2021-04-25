import React from "react"
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
} from "reactstrap"

import usePositions from 'hooks/usePositions';
import PositionsTable from "components/BigFoot/PositionsTable"


const AllPositions = props => {

  //wallet & web3
  const wallet = useWallet()

  const { loadingPositions, allPositions } = usePositions();

  const renderContent = () => {
    if( !wallet.account){ //wallet not connected
      return (
        <div className="text-center">
          <p>Connect your wallet</p>
        </div>
      );
    }else if( loadingPositions ){
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }else{
      return <PositionsTable positions={allPositions} showAll />
    }
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
                    <i className="mdi mdi-playlist-play text-primary h1"/>
                    All Positions
                  </h4>

                  { renderContent() }

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