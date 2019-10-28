import {
  Authenticator,
  Loading,
  RequireNewPassword,
  SignIn
} from "aws-amplify-react";
import classNames from "classnames";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import { AWS } from "@aws-amplify/core";
import axios from "axios";

import labels from "pageObjectLabels";
import NavDrawer from "./nav-drawer";
import routes from "./routes";

import dlgLogo from "assets/dlg-logo.png";

const styles = theme => ({
  app: {
    display: "flex",
    height: "100vh",
    overflowY: "hidden"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit
  },
  dlgLogo: {
    background: `url(${dlgLogo}) center no-repeat`,
    backgroundSize: "contain",
    display: "block",
    width: "35px",
    height: "40px",
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit
  },
  menuButton: {
    color: "black"
  },
  toolbar: theme.mixins.toolbar
});

const getUserdata = () => {
  Auth.currentAuthenticatedUser()
    .then(user => {
      console.log({ user });
      getdetails(user.getSignInUserSession().idToken.jwtToken);
    })
    .catch(err => console.log(err));
};

const getdetails = token => {
  let id_token = token;
  let cognitoParams = {
    IdentityPoolId: "eu-west-1:07586d5b-7854-4dce-9311-e41d1fe9223b",
    Logins: {}
  };
  let region = "eu-west-1";
  let poolId = "eu-west-1_iw0P6wkl9";
  cognitoParams.Logins[
    "cognito-idp." + region + ".amazonaws.com/" + poolId
  ] = id_token;
  AWS.config.update({ region: "eu-west-1" });
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);

  AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    let creds = {
      sessionId: AWS.config.credentials.accessKeyId,
      sessionKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken
    };
    //console.log(creds);
    let credsEncoded = encodeURIComponent(JSON.stringify(creds));
    //console.log(credsEncoded);
    let thisUrlEncoded = encodeURIComponent(
      "https://" + window.location.hostname
    );
    let quicksightUrlEncoded = encodeURIComponent(
      "https://quicksight.aws.amazon.com/"
    );

    const uri =
      "https://signin.aws.amazon.com/federation?Action=getSigninToken&SessionDuration=43200&Session=" +
      credsEncoded;

    console.log(uri);
    let quickSightSSO =
      "https://signin.aws.amazon.com/federation?Action=login&Issuer=" +
      thisUrlEncoded +
      "&Destination=" +
      quicksightUrlEncoded +
      "&SigninToken=";

    console.log(quickSightSSO);
    //window.location.href = quickSightSSO;

    axios
      .get(uri)
      .then(function(response) {
        // handle success
        let quickSightSSO =
          "https://signin.aws.amazon.com/federation?Action=login&Issuer=" +
          thisUrlEncoded +
          "&Destination=" +
          quicksightUrlEncoded +
          "&SigninToken=" +
          response;
        //window.location.href = quickSightSSO;
        console.log(quickSightSSO);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  });

  console.log(AWS.config.credentials);
};

Hub.listen("auth", data => {
  switch (data.payload.event) {
    case "signIn":
      console.log(data);
      getUserdata(data);
      break;
    case "signIn_failure":
      console.log(data);
      break;
    default:
      break;
  }
});

const routeComponents = routes.map(({ path, component, exact }) => (
  <Route key={path} path={path} component={component} exact={exact} />
));

const defaultRoute = routes.find(r => r.isDefault);

const App = ({ authState, classes }) => {
  const [isNavDrawerOpen, setNavDrawerOpen] = useState(false);

  return authState !== "signedIn" ? null : (
    <div className={classes.app}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar data-label={labels.layout.menu.toolbar}>
          <IconButton
            data-label={labels.layout.menu.openButton}
            color="inherit"
            aria-label="Open Navigation Menu"
            onClick={() => setNavDrawerOpen(true)}
            className={classNames(
              classes.menuButton,
              isNavDrawerOpen && classes.hide
            )}
          >
            <MenuIcon />
          </IconButton>
          <i className={classes.dlgLogo} />
          <Typography variant="h6" noWrap>
            Operational Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <NavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setNavDrawerOpen(false)}
      />
      <div className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Redirect from="/" to={defaultRoute.path} exact />
          {routeComponents}
        </Switch>
      </div>
    </div>
  );
};

const StyledApp = withStyles(styles)(App);

const AuthenticatedApp = () => (
  <Authenticator hideDefault={true}>
    <SignIn />
    <RequireNewPassword />
    <Loading />
    <StyledApp />
  </Authenticator>
);

export default AuthenticatedApp;
