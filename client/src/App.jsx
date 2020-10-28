import "./App.css";
import "./Custom.css";

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";

// Material UI
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Paper";
import CardContent from "@material-ui/core/CardContent";

import MicrosoftLogin from "react-microsoft-login";
import queryString from "query-string";
import axios from "axios";

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
    background: {
      light: "#ff5f52",
      main: "#251d1d",
      dark: "#8e0000",
      paper: "#1a1414",
      contrastText: "#fff",
    },
  },
});

// custom CSS
const useStyles = makeStyles((theme) => ({}));

var authData;
var params;

// Router
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path="/">
          <InfoPage />
        </Route>
        <Route path="/register">
          <LandingPage />
        </Route>
        <Route path="/rules">
          <Rules />
        </Route>
        <Route path="/registerSuccess">
          <Success />
        </Route>
        <Route path="/error">
          <Error />
        </Route>
        <Route path="/noToken">
          <NoToken />
        </Route>
        <Route path="/auth/microsoft"></Route>
      </Router>
    </ThemeProvider>
  );
}

function StatusInfo(props) {
  if (props.responseFinal) {
    if (props.responseFinal.online === true) {
      return (
        <div>
          <span className="online statusText">ONLINE</span>
          <br></br>
          <span>
            Players: {props.responseFinal.players.online}/
            {props.responseFinal.players.max}
          </span>
          <br></br>
          <span>Version: {props.responseFinal.version}</span>
        </div>
      );
    } else {
      return <span className="offline statusText">OFFLINE</span>;
    }
  } else {
    return <span>Checking...</span>;
  }
}

// Home Page
function InfoPage() {
  const [mcresponse, setMcResponse] = useState(0);

  useEffect(() => {
    axios.get("https://api.mcsrvstat.us/2/nlaha.com").then((response) => {
      console.log(response.data);
      setMcResponse(response.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="md">
          <Typography variant="h3" className="pageTitle">
            Ballard High School
            <br></br>
            Unofficial Minecraft Server
          </Typography>
          <Typography className="OswaldHeader" variant="h4" gutterBottom>
            Connection Instructions
          </Typography>
          <Container maxWidth="sm">
            <Card className="infoPaper">
              <CardContent>
                <Typography
                  className="OswaldHeader paperText"
                  variant="h5"
                  gutterBottom
                >
                  Server Address:
                </Typography>
                <Typography
                  className="infoParagraph paperText"
                  variant="h6"
                  gutterBottom
                >
                  nlaha.com
                </Typography>
                <Typography
                  className="OswaldHeader paperText"
                  variant="h5"
                  gutterBottom
                >
                  Server Status:
                </Typography>
                <Typography
                  className="infoParagraph paperText"
                  variant="h6"
                  gutterBottom
                >
                  <StatusInfo responseFinal={mcresponse} />
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </Container>
      </header>
    </div>
  );
}

// register page
function LandingPage() {
  const location = useLocation();
  const history = useHistory();
  params = queryString.parse(location.search);

  // exit out if we don't have a token
  if (!params || !params.token) {
    history.push("/noToken");
  }

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

function NoToken() {
  return ShowMessage("Please use the link provided in the Minecraft Server");
}

// Rules Page
function Rules() {
  const history = useHistory();

  // exit out if we don't have a token
  if (!params || !params.token) {
    history.push("/noToken");
  }

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
            If you agree to the above, click "I Agree" below.
          </Typography>
          <a href="/auth/microsoft">
            <Button
              className="large-btn"
              size="large"
              variant="contained"
              color="primary"
            >
              I Agree
            </Button>
          </a>
        </Container>
      </header>
    </div>
  );
}

function ShowMessage(message, messageSubtitle, messageSubtitle2) {
  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="md">
          <Typography variant="h3" className="pageTitle">
            {message}
          </Typography>
          <Typography className="infoParagraph" variant="h6" gutterBottom>
            {messageSubtitle}
          </Typography>
          <Typography className="infoParagraph" variant="h6" gutterBottom>
            {messageSubtitle2}
          </Typography>
          <Link to="/">
            <Button
              className="large-btn"
              size="large"
              variant="contained"
              color="primary"
            >
              Exit
            </Button>
          </Link>
        </Container>
      </header>
    </div>
  );
}

function Success() {
  return ShowMessage(`Sucessfully Registered!`);
}

function Error() {
  return ShowMessage(`Error :(`);
}

export default App;
