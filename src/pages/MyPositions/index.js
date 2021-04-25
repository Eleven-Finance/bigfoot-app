import React from "react"
import { Link } from "react-router-dom"
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


const MyPositions = props => {

  //wallet & web3
  const wallet = useWallet()

  const { loadingPositions, myPositions } = usePositions();

  const renderContent = () => {
    if( !wallet.account ){ //wallet not connected
      return (
        <div className="text-center">
          <p>Connect your wallet</p>
        </div>
      );
    }else if(loadingPositions){
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }else if(myPositions.length===0){
      return(
        <div className="text-center">
          No positions open.<br />
          You can open new positions in the <Link to="/dashboard">Dashboard</Link>
        </div>
      );
    }else{
      return <PositionsTable positions={myPositions} />
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
                    <i className="mdi mdi-playlist-star text-primary h1"/>
                    My Positions
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
export default MyPositions;