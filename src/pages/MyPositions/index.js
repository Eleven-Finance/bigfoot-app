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

import Web3Class from '../../helpers/bigfoot/Web3Class'
import PositionsTable from "components/BigFoot/PositionsTable"


const MyPositions = props => {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);

  useEffect( async () => {
    if(wallet.account) {
      // let allPositions = await web3Instance.getPositions(wallet.account);
      let allPositions = await web3Instance.getPositions("0x6B3C201575aCe5Ed6B67df5c91E40B98c0D2BE36");
      allPositions.sort( (a,b) => parseFloat(b.debtRatio) - parseFloat(a.debtRatio) ); // sort positions by debt in descending order
      setPositions(allPositions);
      setLoading(false);
    }
  }, [wallet]);


  const renderContent = () => {
    if( !wallet.account){ //wallet not connected
      return (
        <div className="text-center">
          <p>Connect your wallet</p>
        </div>
      );
    } else if(loading) { //loading
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    } else if(positions.length===0){
      return(
        <div className="text-center">
          No positions open.<br />
          You can open new positions in the <Link to="/dashboard">Dashboard</Link>
        </div>
      );
    } else { //content
      return <PositionsTable positions={positions} />
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