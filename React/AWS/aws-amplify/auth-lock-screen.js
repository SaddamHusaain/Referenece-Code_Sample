import React, { Component } from 'react';
import { AvForm, AvField, AvGroup, AvInput, } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Container, Row, Col, Alert, CardBody, Card, Button, Label } from "reactstrap";
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.png";
import avatar from "../../assets/images/users/avatar-1.jpg";
import { localStorageService } from '../../Utils/localStorageService';
class LockScreen extends Component {
    state = {
        userDetails: {
            userName: '',
            password: ''
        },
        errMsg: '',
        autoSignedIn: false
    }
    async componentDidMount() {
        let user = await Auth.currentUserInfo()
        // username OR attributes.name
        this.setState({ userDetails: { ...this.state.userDetails, userName: user.username } })

    }
    handleValidSubmit = (event, values) => {
        const { userDetails } = this.state;
        if (userDetails.password !== "") {
            Auth.signIn(userDetails.userName, userDetails.password).then(user => {
                localStorageService.storeAuthUser(user.signInUserSession.idToken.jwtToken);
                this.props.history.goBack();
                this.changeState("signedIn", user);
            }).catch(err => {
                if (err.code === "PasswordResetRequiredException") {
                    this.changeState("requireNewPassword");
                    this.setState({
                        showToast: true,
                        modal: false,
                    });
                } else {
                    this.setState({ errMsg: err.message })
                }
            })
        }
    }
    handleInputChange = (e) => {
        const { userDetails } = this.state;
        if (e.target.type === "checkbox") {
            this.setState({ autoSignedIn: e.target.checked })
            if (e.target.checked === true) { 
                localStorageService.keepMeSignedIn(true);
            }
            else {
                localStorageService.keepMeSignedIn(e.target.checked);
            }
        }
        else {
            userDetails[e.target.name] = e.target.value;
            this.setState({ userDetails })
        }
    }

    render() {
        const { userDetails } = this.state;
        return (
            <React.Fragment>
                <div className="account-pages my-3 pt-sm-3">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md="8" lg="6" xl="5">
                                <Card className="overflow-hidden">
                                    <div className="bg-soft-secondary">
                                        <Row>
                                            <Col className="col-7">
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary"> Lock screen !</h5>
                                                    <p>Enter your password to unlock the screen! </p>
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
                                                <div className="avatar-md profile-user-wid mb-1">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <img src={logo} alt="" className="rounded-circle" height="34" />
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="p-2">
                                            <AvForm className="form-horizontal"
                                                onSubmit={(e) => {
                                                    e.preventDefault(); this.handleValidSubmit()
                                                }}
                                            >
                                                {this.state.errMsg && this.state.errMsg ? <div className="verify-alert"><Alert color="danger" >{this.state.errMsg}</Alert></div> : null}

                                                <div className="user-thumb text-center mb-3">
                                                    <img src={avatar} className="rounded-circle img-thumbnail avatar-md" alt="thumbnail" />
                                                    <h5 className="font-size-15 mt-3">{userDetails.userName}</h5>
                                                </div>
                                                <div className="form-group">
                                                    <AvField
                                                        name="password"
                                                        key="password"
                                                        label="Password"
                                                        type="password"
                                                        required
                                                        value={userDetails.password}
                                                        placeholder="Enter Password"
                                                        onChange={this.handleInputChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <Row>
                                                        <Col sm="6" xs="6" className="text-left">
                                                            <AvGroup check className="ml-3">
                                                                <AvInput type="checkbox" name="autoSignedIn" onChange={this.handleInputChange} />
                                                                <Label check for="checkItOut">Keep me signed in</Label>
                                                            </AvGroup>
                                                            {/* <AvInput type="checkbox" name="autoSignedIn" onChange={this.handleInputChange}></AvInput> */}
                                                        </Col>
                                                        <Col xs="6" className="text-right">
                                                            <Button color="primary" className=" w-md waves-effect waves-light" type="submit">Unlock</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-3 text-center">

                                    <p>Not you ? return <Link to="/" onClick={(e) => {
                                            Auth.signOut().then((data) => { localStorageService.clearLocalStorage();
                                                    this.props.history.push("/");
                                                })
                                                .catch((err) => {console.log(err);});
                                        }}
                                        className="font-weight-medium text-primary"
                                    > Sign In </Link> </p>
                                    <p>{new Date().getFullYear()} © IIMMPACT SDN BHD</p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default LockScreen;

