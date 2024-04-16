const express = require("express");
const app = express();
const getTopics = require("./controller/topics-controller");
const getArticles = require("./controller/articles-controller");
const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get(`/api/articles`, getArticles)
app.get(`/api/articles/:article_id`, getArticles);
app.get(`/api`, (req, res, next) => {
  res.status(200).send(endpoints);
});

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
    res.status(400).send({ message: "invalid id type!" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = app;
