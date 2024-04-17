const { fetchComments, insertComment } = require("../model/comments-model");

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

function postComment(req, res, next){
  const newComment = req.body
  insertComment(newComment).then((comment) => {
    console.log(comment.body);
    res.status(201).send(comment.body)
  }).catch((err) => {
    next(err)
  })

}

module.exports = { getCommentsByArticleId, postComment }
