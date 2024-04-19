const {
  fetchComments,
  insertComment,
  removeCommentById,
  patchCommentById,
  selectCommentById,
} = require("../model/comments-model");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentById(req, res, next) {
  const { comment_id } = req.params;
  selectCommentById(comment_id);
}

function postComment(req, res, next) {
  const newComment = req.body;
  insertComment(newComment)
    .then((comment) => {
      res.status(201).send(comment.body);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  const message = "comment deleted!";
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

function patchComment(req, res, next) {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentById(comment_id, inc_votes).then(() => {
    selectCommentById(comment_id).then((comment) => {
      res.status(200).send({ comment });
    })
  }).catch((err) => {
    next(err)
  })
}

module.exports = {
  getCommentsByArticleId,
  postComment,
  deleteComment,
  patchComment,
  getCommentById,
};
