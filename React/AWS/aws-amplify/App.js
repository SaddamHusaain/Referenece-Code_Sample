import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import history from "./Utils/history";
// import axios from "axios";
import API from "./Utils/api";
// Import Routes
import { authProtectedRoutes } from "./routes/";
import AppRoute from "./routes/route";
import { matchPath } from "react-router";
import store from "./store";
// layouts
import VerticalLayout from "./components/VerticalLayout/";

// import HorizontalLayout from "./components/HorizontalLayout/";

import "./assets/scss/theme.scss";
import "react-toastify/dist/ReactToastify.css";

//-v 16.13.1
// import AWS from 'aws-sdk';
import Amplify, { Auth } from "aws-amplify";
import { Authenticator, ForgotPassword, ConfirmSignUp, Greetings, SignIn, SignUp, RequireNewPassword } from "aws-amplify-react";

import Register from "./pages/Authentication/Register";
import Login from "./pages/Authentication/Login";
import ForgetPassword from "./pages/Authentication/ForgetPassword";
import ConfirmRegister from "./pages/Authentication/ConfirmRegister";
import NewPassword from "./pages/Authentication/NewPassword";
import * as types from "./store/product/actionTypes";
import moment from "moment";

// Toast configuration
toast.configure({ autoClose: 5000, draggable: false });

Amplify.configure({
  identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
  userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
  identityPoolRegion: process.env.REACT_APP_AWS_REGION,
  userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEBCLIENT_ID,
  oauth: {
    domain: process.env.REACT_APP_AWS_OAUTH_DOMAIN,
    scope: ["id", "name", "full_name", "email", "openid", "profile", "public_profile", "aws.cognito.signin.user.admin"],
    redirectSignIn: process.env.REACT_APP_AWS_REDIRECT_SIGNIN_URL,
    redirectSignOut: process.env.REACT_APP_AWS_REDIRECT_SIGNOUT_URL,
    responseType: "token",
  },
});

const federated = {
  google_client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  facebook_app_id: process.env.REACT_APP_FACEBOOK_APP_ID,
};
const App = (props) => {
  // const [user, setUser] = useState({});
  const [hideFinancing, setHideFinancing] = useState(false);
  const [balance, setBalance] = useState("~");
  const [compomentRender, setCompomentRender] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  // const [showProduct, setShowProduct] = useState(true)
  const Layout = props.layout;
  useEffect(() => {
    if (props.authState === "signedIn" && showBalance && !matchPath(window.location.pathname, "/lock-screen")) {
      setShowBalance(false);
      setCompomentRender(true);
      let user;
      API.get("balance").then((response) => {
        if (response.data.message && response.data.message === "Server Error") {
          Auth.currentAuthenticatedUser().then((data) => {
            user = data.attributes.name;
            console.log(data.attributes.name);
            let first = data.attributes.name.split(" ");
            API.post("signup", { name: first[0] }).then((res) => {
              window.location.reload();
            },
              (error) => {
                if (error) {
                  window.location.reload();
                }
              }
            );
          });
          setBalance(response.data.data.balance);
        }
        setBalance(response.data.data.balance);
      })
        .catch((error) => console.log(error));
      API.get("products").then(
        (res) => {
          let data = res.data;
          if (data.data) {
            const elementsIndex = data.data.findIndex(
              (element) => element.product_code == "PTPTN"
            );
            let newArray = data.data;
            if (elementsIndex !== -1) {
              newArray[elementsIndex] = {
                ...newArray[elementsIndex],
                discount: "RM1 surcharge",
              };
            }
            store.dispatch({ type: types.PRODUCT_DETAILS, payload: newArray });
          }
        },
        (error) => { }
      );

      let dateto = moment(new Date())
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM-DD");
      let datefrom = moment(new Date())
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
      API.get("invoice", {
        params: { type: "DEPOSIT", date: ` ${dateto} - ${datefrom}` },
      }).then((response) => {
        if (response.data.data.length) {
          let hide = true;
          setHideFinancing(hide);
        } else {
          setHideFinancing(false);
        }
      });
    } else {
      setShowBalance(true);
      setCompomentRender(true);
    }
    changeApplicationColor();
  }, [props.authState]);

  function changeApplicationColor() {
    localStorageService.setColor();
    let color = localStorageService.getColor();
    const lengthindex = color.length - 1;
    const backgroundColor = color.slice(0, lengthindex) + ", 0.25" + color.slice(lengthindex);
    document.documentElement.style.setProperty("--color-primary", color);
    document.documentElement.style.setProperty("--color-light", backgroundColor);
  }
  if (props.authState === "signedIn") {
    return (
      <>
        {compomentRender && (
          <Router basename="/" history={history}>
            <Switch>
              {authProtectedRoutes.map((route, idx) => (
                <AppRoute
                  path={route.path}
                  layout={Layout}
                  component={route.component}
                  key={idx}
                  isAuthProtected={true}
                  isAuthProtectedInner={route.isAuthProtectedInner}
                  balance={balance}
                  hideFinancing={hideFinancing}
                  authState={props.authState}
                />
              ))}
            </Switch>
          </Router>
        )}
      </>
    );
  } else {
    return null;
  }
};

class AppWithAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getLayout = this.getLayout.bind(this);
  }

  getLayout = () => {
    let layoutCls = VerticalLayout;
    return layoutCls;
  };
  render() {
    const Layout = this.getLayout();
    return (
      <React.Fragment>
        <ToastContainer />
        <Authenticator
          federated={federated}
          hide={[
            Greetings,
            SignIn,
            SignUp,
            ConfirmSignUp,
            RequireNewPassword,
            ForgotPassword,
          ]}
        >
          <Login override={"SignIn"} />
          <NewPassword override={"RequireNewPassword"} />
          <Register override={"SignUp"} signUpConfig={signUpConfig} />
          <ConfirmRegister />
          <ForgetPassword override={"forgotPassword"} />
          <App layout={Layout} />
        </Authenticator>
      </React.Fragment>
    );
  }
}

const signUpConfig = {
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "Username",
      key: "username",
      required: true,
      placeholder: "Enter username",
      type: "text",
      displayOrder: 1,
    },
    {
      label: "Name",
      key: "name",
      required: true,
      placeholder: "Enter name",
      type: "text",
      displayOrder: 2,
    },
    {
      label: "Email",
      key: "email",
      required: true,
      placeholder: "Enter email",
      type: "email",
      displayOrder: 3,
    },
    {
      label: "Phone No.",
      key: "phone_number",
      required: true,
      placeholder: "Enter phone No.",
      type: "text",
      displayOrder: 4,
    },
    {
      label: "Password",
      key: "password",
      required: true,
      placeholder: "Enter password",
      type: "password",
      displayOrder: 5,
    },
  ],
};

export default withRouter(AppWithAuth);
