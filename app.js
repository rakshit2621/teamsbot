const express = require("express");
const app = express();

app.use(express.json());

// Attach routes
app.use("/", require("./routes/messageRoute"));
app.use("/", require("./routes/syncRoute"));
app.use("/", require("./routes/filterRoute"));

module.exports = app;
