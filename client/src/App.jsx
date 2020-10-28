import "./App.css";
import "./Custom.css";

import config from "./config/config";

import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Material UI
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import MicrosoftLogin from "react-microsoft-login";

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";

// MUI Theme for custom red buttons and stuff
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#ff5f52",
      main: "#c62828",
      dark: "#8e0000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#48a999",
      main: "#00796b",
      dark: "#004c40",
      contrastText: "#000",
    },
  },
});

// custom CSS
const useStyles = makeStyles((theme) => ({}));

// Router
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/rules">
          <Rules />
        </Route>
        <Route path="/oauthCallback">
          <OAuthCallback />
        </Route>
      </Router>
    </ThemeProvider>
  );
}

var authData = "no data";

const authHandler = (err, data) => {
  authData = data;
  if (err) {
    authData = err;
  }
};

// Index Page
function LandingPage() {
  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="md">
          <Typography variant="h3" className="pageTitle">
            Ballard High School
            <br></br>
            Unofficial Minecraft Server
          </Typography>
          <Typography className="infoParagraph" variant="h6" gutterBottom>
            We need everyone to register with their school email accounts. We
            don't store any of this information aside from an ID that identifies
            you on the server.
            <br></br>
            <br></br>
            Please contact Nathan Laha on MS Teams with any further questions.
          </Typography>
          <Link to="/rules">
            <Button
              className="large-btn"
              size="large"
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          </Link>
        </Container>
      </header>
    </div>
  );
}

// Rules Page
function Rules() {
  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="md">
          <Typography variant="h3" className="pageTitle">
            Rules & Terms of Use
          </Typography>
          <Typography className="infoParagraph" variant="h6" gutterBottom>
            Everyone (including admins and moderators) must follow GCC & SPS
            guidlines. Anyone who breaks these rules will be banned. At GCC, we
            follow the contributer covenant, it offers some pretty good
            guidelines to go by.
            <br></br>
            <br></br>
            <a href="https://www.contributor-covenant.org/">
              Contributor Covenant
            </a>
            <br></br>
            <br></br>
            In addition to the obvious, try to respect people's builds.
            Destroying other builds isn't prohibited, but going around randomly
            spawning TNT is going to get you banned pretty quickly.
            <br></br>
            <br></br>
            If you agree to the above, click the Microsoft login button to
            proceed.
          </Typography>
          <MicrosoftLogin
            clientId={config.client_id}
            authCallback={authHandler}
          />
        </Container>
      </header>
    </div>
  );
}

// OAuth Callback
function OAuthCallback() {
  return <h1>Registered Sucessfully! {authData}</h1>;
}

export default App;
