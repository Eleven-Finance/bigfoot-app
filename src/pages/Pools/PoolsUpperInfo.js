import React, {useState} from 'react'
import liquidityAssets from '../../data/liquidityAssets'
import {
  Container,
  Row,
  Button,
  Col,
  Card,
  CardBody,
  Table,
} from "reactstrap"

function PoolsUpperInfo() {
  
  const [assets, setassets] = useState(liquidityAssets);

  return (
    <Row className="equal-height">
      <Col md="4">
        <Card>
          <CardBody>
            <h4 className="card-title">
              <i className="mdi mdi-lock text-primary h1" />
              Total Value Locked in WWW Pool on ZZZ
            </h4>
            <Row>
              <Col sm="12">
                <p className="total-value">$ 0.00</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col md="8">
        <Card>
          <CardBody>
            <Row>
              <Col md="6">
                <h4 className="card-title">
                  <i className="mdi mdi-cash-check text-primary h1" />
                  Your Liquidity
                </h4>
              </Col>
              <Col md="6">
                <p className="text-end mt-3">
                  <i className="mdi mdi-noodles text-primary me-1" />
                  Accumulated NOODLE: 0.000
                </p>
              </Col>
            </Row>

            <Row>
              <Col sm="12">
                <Table className="table table-nowrap align-middle text-center mb-0">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Total Added</th>
                      <th scope="col">Staked Balance</th>
                      <th scope="col">Current Balance</th>
                      <th scope="col" className="text-end">Net Gain (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset, key) => (
                      <tr key={key}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-xs me-3">
                              <span
                                className={
                                  "avatar-title rounded-circle bg-soft bg-" +
                                  asset.color +
                                  " text-" +
                                  asset.color +
                                  " font-size-18"
                                }
                              >
                                <i className={asset.icon} />
                              </span>
                            </div>
                            <span>{asset.title}</span>
                          </div>
                        </td>
                        <td>
                          <h5 className="font-size-14 mb-1">
                            {asset.totalAdded}
                          </h5>
                        </td>
                        <td>
                          <h5 className="font-size-14 mb-1">
                            {asset.stakedBalance}
                          </h5>
                        </td>
                        <td>
                          <h5 className="font-size-14 mb-1">
                            {asset.currentBalance}
                          </h5>
                        </td>
                        <td className="text-end">
                          <h5 className="font-size-14 mb-1">
                            {asset.netGain}
                            <br />
                          </h5>

                          <h5 className="font-size-14 mb-1">
                            {
                              parseFloat(asset.netGainDiff) < 0 ?
                                <i className="mdi mdi-arrow-down" /> :
                                <i className="mdi mdi-arrow-up" />
                            }
                                  ({asset.netGainDiff} %)
                                </h5>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row>
              <Col md="6" className="mt-3">
                <Button
                  outline
                  block
                  onClick={() => {
                    console.log("Remove Liquidity")
                  }}
                >
                  Remove Liquidity
                </Button>
              </Col>
              <Col md="6" className="mt-3">
                <Button
                  outline
                  block
                  onClick={() => {
                    console.log("Unstake & Remove Liquidity")
                  }}
                >
                  Unstake & Remove Liquidity
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default PoolsUpperInfo;