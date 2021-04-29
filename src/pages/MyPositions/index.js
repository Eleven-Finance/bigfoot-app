import React, { useState, useEffect } from "react"
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
import Calculator from "helpers/bigfoot/Calculator";


const MyPositions = props => {

  //wallet & web3
  const wallet = useWallet()

  const { isLoadingPositions, myPositions, updatePositions } = usePositions();

  const [myPositionsList, setMyPositionsList] = useState();

  
  useEffect(() => {
    const list = myPositions.map( position => {
      Object.assign(position, Calculator.getPositionDetails(position))
      return position;
    });

    //sort by debt in descending order
    list.sort( (a,b) => parseFloat(b.debtRatio) - parseFloat(a.debtRatio) );

    setMyPositionsList(list);
  }, [myPositions]);


  const renderContent = () => {
    if( !wallet.account ){ //wallet not connected
      return (
        <div className="text-center">
          <p>Connect your wallet</p>
        </div>
      );
    }else if(isLoadingPositions){
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
      return <PositionsTable positions={myPositionsList} updatePositions={updatePositions} />
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