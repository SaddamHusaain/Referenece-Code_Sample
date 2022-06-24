import React, { } from "react";

import { Row, Col, CardBody, Card, Alert, Label } from "reactstrap";

import { Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField, AvGroup, AvInput } from "availity-reactstrap-validation";
import "react-intl-tel-input/dist/main.css";

import { Auth } from "aws-amplify";
import { SignIn } from "aws-amplify-react";
import API from "../../Utils/api";
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.png";
import facebook from "../../assets/images/facebook.png";
import google from "../../assets/images/google.png";


import { localStorageService } from '../../Utils/localStorageService';
import { withRouter } from 'react-router-dom'

class Login extends SignIn {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: ''
    };
    this._validAuthStates = ["signIn", "signedOut", "signedUp"];
    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

  }
  handleCheckboxChange = (e) => {
    const { userDetails } = this.state;
    if (e.target.type === "checkbox") {
      this.setState({ autoSignedIn: e.target.checked })
      if (e.target.checked === true) {
        localStorageService.keepMeSignedIn(true);
      } else {
        localStorageService.keepMeSignedIn(e.target.checked);
      }
    }
  }
  
  getHash() {
    let hashes = [];

    if (window.location.hash) {
      window.location.hash.split("&").forEach((v, i) => {
        let s = v.split("=");
        let k = s[0].replace("#", "");
        let w = decodeURIComponent(s[1].replace(/\+/g, " "));

        hashes[k] = w;
      });
    }
    return hashes;
  }
  autoSignIn = async () => {
    // only perform auto signed in if users didn't refresh page
    if (this.props.tempInfo.u !== '' && this.props.tempInfo.p !== '') {
      try {
        const user = await Auth.signIn(
          this.props.tempInfo.u,
          this.props.tempInfo.p
        );
        this.props.setTempInfo({ u: '', p: '' }); //Clear temp info after successful sign in
        this.checkContact(user);
      } catch (err) {
        console.log(err);
      }
    }
  }
  componentDidMount() {
    let hashes = this.getHash();

    if (hashes.error_description) {
      if (
        hashes.error_description.includes("Already found an entry for username")
      ) {
        hashes.error_description =
          "Account successfully linked, please re-logged in";
      }
    }
  }

  handleValidSubmit = async (event) => {
    event.preventDefault();
    let user = { username: this.inputs.username, password: this.inputs.password }
    // let resp = super.signIn();
    Auth.signIn(this.inputs.username, this.inputs.password).then(user => {
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
       this.changeState("requireNewPassword", user);;
      }
      else {
        localStorageService.storeAuthUser(user.signInUserSession.idToken.jwtToken);
        const token = localStorageService.getAuthorizationToken()
        this.changeState("signedIn", user);
        this.setState({ errMsg: "" })
      }
    }).catch(err => {

      if (err.code === "UserNotConfirmedException") {
        this.changeState("confirmSignUp", user);
      } else if (err.code === "PasswordResetRequiredException") {
        this.changeState("forgotPassword");
      } else {
        this.setState({ errMsg: err.message })
      }
    });
  };

  showComponent(theme) {
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
                        <div className="text-primary p-3">
                          <h5 className="text-primary"> Welcome Back !</h5>
                          <p>Sign In to continue to IIMMPACT.</p>
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
                            <img src={logo} alt="" className="rounded-circle" height="70" ></img>
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      {/* onValidSubmit={this.handleValidSubmit} */}
                      <AvForm className="form-horizontal" onValidSubmit={(e) => this.handleValidSubmit(e)} >
                        {this.state.errMsg && this.state.errMsg ? (<Alert color="danger">{this.state.errMsg}</Alert>) : null}
                        <div className="form-group">
                          <AvField
                            id="username"
                            key="username"
                            name="username"
                            onChange={this.handleInputChange}
                            label="Username"
                            className="form-control"
                            placeholder="Enter username or email address"
                            type="text"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <AvField
                            id="password"
                            key="password"
                            name="password"
                            onChange={this.handleInputChange}
                            label="Password"
                            type="password"
                            required
                            placeholder="Enter password"
                          />
                        </div>
                        <div className="mt-3">
                          <button className="btn btn-primary btn-block waves-effect waves-light"
                            type="submit"> Sign In </button>
                        </div>
                        <div className="mt-4 text-center">
                          <AvGroup check className="ml-3">
                            <AvInput type="checkbox" name="autoSignedIn" onChange={this.handleCheckboxChange} />
                            <Label check for="checkItOut" className="text-muted">Keep me signed in</Label>
                          </AvGroup>
                          <Link to="/"
                            onClick={(e) => { e.preventDefault(); this.changeState("forgotPassword"); }}
                            className="text-muted"
                          >{" "} <i className="mdi mdi-lock mr-1"></i> Forgot password?
                          </Link>
                        </div>
                      </AvForm>
                    </div>
                    <p className="mt-1 mb-2 text-muted text-center">OR</p>

                    <div style={{ textAlign: "center" }}>
                      <button id="google-signin-button" type="button"
                        className="css-1graipa" onClick={() => Auth.federatedSignIn({ provider: "Google" })}>
                        <span className="css-1vqao0l">
                          <span className="css-t5emrf">
                            <img src={google} alt="" height="20" width="20" className="mr-2"></img>
                            <span>Continue with Google</span>
                          </span>
                        </span>
                      </button>
                      <button id="google-signin-button" type="button" className="css-1graipa"
                        onClick={() => Auth.federatedSignIn({ provider: "Facebook" })}>
                        <span className="css-1vqao0l">
                          <span className="css-t5emrf">
                            <img src={facebook} alt="" height="20" width="20" className="mr-2" ></img>
                            <span>Continue with Facebook</span>
                          </span>
                        </span>
                      </button>
                    </div>
                  </CardBody>
                </Card>
                <div className="text-center">
                  <p>
                    Don't have an account ?{" "}
                    <Link to="/"
                      onClick={(e) => { e.preventDefault(); this.changeState("signUp"); }}
                      className="font-weight-medium text-primary"
                    >
                      {" "}
                      Sign Up now{" "}
                    </Link>{" "}
                  </p>
                  <p>{new Date().getFullYear()} © IIMMPACT SDN BHD</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Login);
// export default withRouter(connect(mapStatetoProps, { loginUser,apiError })(Login));
