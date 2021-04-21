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

import Web3Class from '../../helpers/bigfoot/Web3Class'
import PositionsTable from "components/BigFoot/PositionsTable"


const AllPositions = props => {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [positions, setPositions] = useState([]);


  useEffect( async () => {
    if(wallet.account) {
      let allPositions = await web3Instance.getAllPositions();
      allPositions.sort( (a,b) => parseFloat(b.debtRatio) - parseFloat(a.debtRatio) ); // sort positions by debt in descending order
      setPositions(allPositions);
    }
  }, [wallet]);


  const renderContent = () => {
    if( !wallet.account){ //wallet not connected
      return (
        <div className="text-center">
          <p>Connect your wallet</p>
        </div>
      );
    } else if( !positions.length ) { //loading
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    } else { //content
      return <PositionsTable positions={positions} showAll />
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