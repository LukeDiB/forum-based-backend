const {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
  removeComment,
} = require("../model/articles-model");

function getArticles(req, res, next) {
  const { article_id } = req.params;
  const { order, sort_by, topic } = req.query;
  if (article_id === undefined) {
    selectAllArticles(order, sort_by, topic)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    selectArticleById(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
  }
}

function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(() => {
      selectArticleById(article_id).then((article) => {
        res.status(200).send({ article });
      });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteCommentFromArticle(req, res, next) {
  const { comment_id } = req.params;
  const message = "comment deleted!";
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { patchArticle, getArticles, deleteCommentFromArticle };
