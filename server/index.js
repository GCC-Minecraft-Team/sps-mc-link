const express = require("express");

// configure Express app and install the JSON middleware for parsing JSON bodies
const app = express();
app.use(express.json());

// use routes
app.use("/", express.static("../client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// start server
app.listen(9090, () =>
  console.log(`Express server listening on port ${9090}.`)
);
