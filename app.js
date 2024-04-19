const express = require("express");
const app = express();
const apiRouter = require('./routes/api-router');

app.use(express.json());

app.use('/api', apiRouter)

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "path not found!" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "42601") {
    res.status(400).send({ message: "bad order!" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === `22P02`) {
    res.status(400).send({ message: "invalid input!" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = app;
