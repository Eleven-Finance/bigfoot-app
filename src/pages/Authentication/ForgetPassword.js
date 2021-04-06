import PropTypes from 'prop-types'
import MetaTags from 'react-meta-tags';
import React from "react"
import { Row, Col, Alert, Card, CardBody, Container } from "reactstrap"

// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { userForgetPassword } from "../../store/actions"

// import images
import profile from "../../assets/images/profile-img.png"
import logo from "../../assets/images/logo.svg"

const ForgetPasswordPage = props => {
  function handleValidSubmit(event, values) {
    props.userForgetPassword(values, props.history)
  }

  return (
    <React.Fragment>
     <MetaTags>
          <title>Forget Password | BigFoot - powered by eleven.finance</title>
        </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-softbg-soft-primary">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Skote.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {props.forgetError && props.forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {props.forgetError}
                      </Alert>
                    ) : null}
                    {props.forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {props.forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <AvForm
                      className="form-horizontal"
                      onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                    >
                      <div className="mb-3">
                        <AvField
                          name="email"
                          label="Email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          required
                        />
                      </div>
                      <Row className="mb-3">
                        <Col className="text-right">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            type="submit"
                          >
                            Reset
                          </button>
                        </Col>
                      </Row>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func
}

const mapStatetoProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword
  return { forgetError, forgetSuccessMsg }
}

export default withRouter(
  connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage)
)
