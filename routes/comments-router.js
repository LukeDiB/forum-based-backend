const {
  deleteComment,
  patchComment,
  getCommentById,
} = require("../controller/comments-controller");

const commentsRouter = require("express").Router();

commentsRouter
  .route(`/:comment_id`)
  .get(getCommentById)
  .delete(deleteComment)
  .patch(patchComment);

module.exports = commentsRouter;
