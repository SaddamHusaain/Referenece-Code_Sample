import React, { Component } from "react";
import { Row, Col, Alert, Card, CardBody } from "reactstrap";

import { ForgotPassword } from "aws-amplify-react";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.png";

class ForgetPasswordPage extends ForgotPassword {
  constructor(props) {
    super(props);
    this.state = {};

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // handleValidSubmit
  handleValidSubmit(event, values) {
    this.props.userForgetPassword(values, this.props.history);
  }

  showComponent(theme) {
    const { authState, hide, authData = {} } = this.props;
    return (
      <React.Fragment>
        <div className="account-pages my-4 pt-sm-2">
          <div className="container">
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-soft-secondary">
                    <Row>
                      <Col className="col-7">
                        <div className="text-primary p-4">
                          <h5 className="text-primary"> Reset Password !</h5>
                          <p>Reset to continue to IIMPACT.</p>
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
                              height="70"
                            ></img>
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="">
                      {this.props.forgetError && this.props.forgetError ? (
                        <Alert color="danger">{this.props.forgetError}</Alert>
                      ) : null}
                      {this.props.forgetSuccessMsg ? (
                        <Alert color="success">
                          {this.props.forgetSuccessMsg}
                        </Alert>
                      ) : null}

                      <AvForm
                        className="form-horizontal mt-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.state.delivery || authData.username
                            ? this.submit()
                            : this.send();
                        }}
                      >
                        {this.state.delivery || authData.username ? (
                          <React.Fragment>
                            <div className="form-group">
                              <AvField
                                name="code"
                                label="Enter code"
                                className="form-control"
                                placeholder="code"
                                type="text"
                                onChange={this.handleInputChange}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <AvField
                                name="password"
                                label="New Password"
                                className="form-control"
                                placeholder="Enter new password"
                                type="password"
                                onChange={this.handleInputChange}
                                required
                              />
                            </div>
                          </React.Fragment>
                        ) : (
                            <div className="form-group">
                              <AvField
                                name="username"
                                label="Username"
                                className="form-control"
                                placeholder="Enter username or email address"
                                type="text"
                                onChange={this.handleInputChange}
                                required
                              />
                            </div>
                          )}
                        {this.state.delivery || authData.username ? (
                          <div className="row">
                            <div className="col-md-6">
                              <button
                                className="btn btn-link"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.send();
                                }}
                              >
                                Resend Code
                              </button>
                            </div>
                            <div className="col-md-6">
                              <div className="text-right">
                                <button
                                  className="btn btn-primary w-md waves-effect waves-light"
                                  type="submit"
                                >
                                  SUBMIT
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                            <button
                              className="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >
                              SEND CODE
                          </button>
                          )}
                      </AvForm>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Go back to{" "}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        this.changeState("signIn");
                      }}
                      className="font-weight-medium text-primary btn-link"
                    >
                      {" "}
                      login{" "}
                    </button>
                  </p>
                  <p>© {new Date().getFullYear()} IIMMPACT SDN BHD</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(
  connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage)
);
