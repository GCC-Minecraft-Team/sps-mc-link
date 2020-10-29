const express = require("express");
const path = require("path");
const axios = require("axios");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const passport = require("passport");
var AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;

const mongoose = require("mongoose");

// MongoDB Databse
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

/** MONGO DB CONNECTION */

const uri = `mongodb://${user}:${password}@${host}:${port}/mclink?authSource=admin`;
console.log(uri);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// open connection to DB
db.on("error", (e) => {
  console.error(e);
  process.exit(999);
});

db.once("open", async function () {
  console.info("MongoDB Connected Successfully");
});

// make user DB schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
  oAuthId: { type: String, required: true },
  oAuthData: { type: Object, required: true },
});

// make a mongoose model based on the schema
var User = mongoose.model("User", userSchema);

/** BEGIN EXPRESS APP */

// configure Express app and install the JSON middleware for parsing JSON bodies
const app = express();
app.use(express.json());

// implement functions for created mongoose model
async function findOrCreate(oAuthData) {
  try {
    const user = await User.findOne({ oAuthId: oAuthData.oid });
    if (!user) {
      const newUser = new User({
        oAuthId: oAuthData.oid,
      });
      await newUser.save();
      return newUser;
    }
    return user;
  } catch (e) {
    return Error("User not found");
  }
}

function fineById(id) {
  return User.findOne({ oAuthId: id });
}

// use routes
app.use("/", express.static("../client/build"));

app.get("/rules", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.get("/register", (req, res) => {
  app.set("mctoken", req.query.token);

  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.get("/registerSuccess", (req, res) => {
  // TODO: Verify user login
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.get("/noToken", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

/** PASSPORT */

passport.serializeUser(function (user, done) {
  done(null, user.oid);
});

passport.deserializeUser(function (id, done) {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new AzureAdOAuth2Strategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_REDIRECT,
      resource: "00000002-0000-0000-c000-000000000000",
      tenant: "seattleschools.org",
    },
    function (accessToken, refresh_token, params, profile, done) {
      // currently we can't find a way to exchange access token by user info (see userProfile implementation), so
      // you will need a jwt-package like https://github.com/auth0/node-jsonwebtoken to decode id_token and get waad profile
      var waadProfile = jwt.decode(params.id_token);

      findOrCreate(waadProfile);
      done(null, waadProfile);
    }
  )
);

// Authorize OAuth data with microsoft, make sure the user is who they say they are.
app.get("/auth/microsoft", passport.authenticate("azure_ad_oauth2"));

app.get(
  "/auth/microsoft/callback",
  passport.authenticate("azure_ad_oauth2", { failureRedirect: "/error" }),
  function (req, res) {
    req.session.user = req.user;
    console.log(req.user.oid);

    axios
      .post(process.env.MC_URL, {
        token: req.session.user.oid,
        id: app.get("mctoken"),
      })
      .then(function (response) {
        // sucess?
        // Successful authentication, redirect.
        res.redirect("/registerSuccess");
      })
      .catch(function (error) {
        console.log(error);
        res.redirect("/error");
      });
  }
);

// start server
app.listen(9090, () =>
  console.log(`Express server listening on port ${9090}.`)
);
