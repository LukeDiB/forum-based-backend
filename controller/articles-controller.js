const { selectArticleById, selectAllArticles } = require("../model/articles-model");

function getArticles(req, res, next) {
  const { article_id } = req.params;
  const { order, sort_by } = req.query;
  if(article_id === undefined) {
    selectAllArticles(order, sort_by)
      .then((articles) => {
        res.status(200).send(articles);
      })
      .catch((err) => {
        next(err);
      });
  } else {
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
  }
}

module.exports = getArticles;