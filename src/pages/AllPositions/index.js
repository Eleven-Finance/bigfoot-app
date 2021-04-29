import React, {useState, useEffect} from "react"
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


const AllPositions = props => {

  //wallet & web3
  const wallet = useWallet()

  const { isLoadingPositions, allPositions, updatePositions } = usePositions();

  const [allPositionsList, setAllPositionsList] = useState();

  
  useEffect(() => {
    const list = allPositions.map( position => {
      Object.assign(position, Calculator.getPositionDetails(position))
      return position;
    });

    //sort by debt in descending order
    list.sort( (a,b) => parseFloat(b.debtRatio) - parseFloat(a.debtRatio) );

    setAllPositionsList(list);
  }, [allPositions]);


  const renderContent = () => {
    if( !wallet.account){ //wallet not connected
      return (
        <div className="text-center">
          <p>Connect your wallet</p>
        </div>
      );
    }else if( isLoadingPositions ){
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }else{
      return <PositionsTable positions={allPositionsList} updatePositions={updatePositions} showAll />
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