import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import axios from "axios";
import { blue, orange } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import App from "components/app";
import getAuthToken from "utils/getAuthToken";

import "typeface-roboto";

const {
  REACT_APP_COGNITO_REGION: region,
  REACT_APP_COGNITO_USERPOOLID: userPoolId,
  REACT_APP_COGNITO_APPCLIENTID: appClientId
} = process.env;

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: region,
    userPoolId: userPoolId,
    userPoolWebClientId: appClientId,
    IdentityPoolId: "eu-west-1:07586d5b-7854-4dce-9311-e41d1fe9223b"
  }
});

const oauth = {
  domain: "dlgtestad.auth.eu-west-1.amazoncognito.com",
  scope: [
    "phone",
    "email",
    "profile",
    "openid",
    "aws.cognito.signin.user.admin"
  ],
  redirectSignIn: "https://rvbj.dlgdeops.co.uk",
  redirectSignOut: "https://rvbj.dlgdeops.co.uk",
  responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
  options: {
    // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
    AdvancedSecurityDataCollectionFlag: false
  }
};

Auth.configure({ oauth });

axios.interceptors.request.use(config => {
  const token = getAuthToken();
  config.headers.Authorization = token;
  return config;
});

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: orange
  },
  mixins: {
    toolbar: {
      height: 56,
      paddingLeft: 8
    }
  }
});

const render = Component => {
  ReactDOM.render(
    <Router>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component />
      </MuiThemeProvider>
    </Router>,
    document.getElementById("root")
  );
};

render(App);

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("components/app", () => {
    const NextApp = require("components/app").default;
    render(NextApp);
  });
}
