const getArticleById = require("../model/articles-model");

function getArticles(req, res, next) {
  const { article_id } = req.params;
  getArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err)
    });
}

module.exports = getArticles;
