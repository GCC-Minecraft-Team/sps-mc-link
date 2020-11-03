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

import queryString from "query-string";
import axios from "axios";
import Cookies from "js-cookie";

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";

// MUI Theme for custom red buttons and stuff
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#63a4ff",
      main: "#1976d2",
      dark: "#004ba0",
      contrastText: "#fff",
    },
    secondary: {
      light: "#98ee99",
      main: "#66bb6a",
      dark: "#338a3e",
      contrastText: "#000",
    },
    background: {
      light: "#63a4ff",
      main: "#1976d2",
      dark: "#004ba0",
      paper: "#16171c",
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
      <div className="App">
        <header className="App-header">
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
            <Route path="/name">
              <Name />
            </Route>
            <Route path="/auth/microsoft"></Route>
            <footer className="App-footer">
              This is a project developed by SPS students
              <br></br>
              <br></br>
              Hosting - <a href="https://nlaha.com">Nathan Laha</a>
            </footer>
          </Router>
        </header>
      </div>
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
    axios.get("https://api.mcsrvstat.us/2/play.spsmc.net").then((response) => {
      console.log(response.data);
      setMcResponse(response.data);
    });
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h3" className="pageTitle">
        Seattle Public Schools
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
              play.spsmc.net
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
  );
}

// register page
function LandingPage() {
  const location = useLocation();
  const history = useHistory();
  params = queryString.parse(location.search);
  Cookies.set("mctoken", params.token);

  // exit out if we don't have a token
  if (!params || !params.token) {
    history.push("/noToken");
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" className="pageTitle">
        Seattle Public Schools
        <br></br>
        Unofficial Minecraft Server
      </Typography>
      <Typography className="infoParagraph" variant="h6" gutterBottom>
        We need everyone to register with their school email accounts. We store
        your school email in a secure database to identify players who have
        violated the server rules. To keep this server a safe environment for
        everyone,{" "}
        <b>
          everything you say or build will be linked to your school account.
        </b>
        <br></br>
        <br></br>
        We will not hesitate to report serious rule violations to the school.
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
  );
}

function NoToken() {
  return ShowMessage("Please use the link provided in the Minecraft Server");
}

// Rules Page
function Rules() {
  const history = useHistory();

  // exit out if we don't have a token or a name
  if (!Cookies.get("mctoken")) {
    history.push("/noToken");
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" className="pageTitle">
        Rules & Terms of Use
      </Typography>
      <Typography className="infoParagraph" variant="h6" gutterBottom>
        Everyone (including admins and moderators) must follow SPS guidlines.
        Anyone who breaks these rules will be banned. We also enforce the
        contributer covenant where applicable, it's a good set of rules used by
        most major tech companies for software development.
        <br></br>
        <br></br>
        <a href="https://www.contributor-covenant.org/">Contributor Covenant</a>
        <br></br>
        <br></br>
        In addition to the obvious, try to respect people's builds. Destroying
        other builds isn't prohibited, but going around randomly spawning TNT is
        going to get you banned pretty quickly.
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
  );
}

function Name() {
  const history = useHistory();
  const [name, setName] = useState(0);

  // exit out if we don't have a token
  if (!Cookies.get("mctoken")) {
    history.push("/noToken");
  }

  async function getName() {
    await axios
      .get("/generateName", {})
      .then(function (response) {
        console.log(response.data);
        setName(response.data);
      })
      .catch(function (error) {
        console.log(error);
        history.push("/error");
      });
  }

  useEffect(() => {
    getName();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h3" className="pageTitle">
        Name Generation
      </Typography>
      <Typography className="infoParagraph" variant="h6" gutterBottom>
        Since we haven't gotten approval from SPS allowing us to use your real
        names, and we want to keep things school apropriate, we need to generate
        a username for you!
        <br></br>
        <br></br>
        Keep in mind this is random so you can always click "Regenerate" to
        change it. This is the username that other people will see in game.
        <Card className="name-card">
          <Typography variant="h3" className="pageTitle">
            {name}
          </Typography>
        </Card>
      </Typography>
      <Button
        onClick={() => {
          getName();
        }}
        className="large-btn multi-button"
        size="large"
        variant="contained"
      >
        Regenerate
      </Button>
      <a href="/rules">
        <Button
          className="large-btn multi-button"
          size="large"
          variant="contained"
          color="primary"
        >
          Continue
        </Button>
      </a>
    </Container>
  );
}

function ShowMessage(message, messageSubtitle, messageSubtitle2) {
  return (
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
  );
}

function Success() {
  return ShowMessage(`Sucessfully Registered!`);
}

function Error() {
  return ShowMessage(`Error :(`);
}

export default App;
