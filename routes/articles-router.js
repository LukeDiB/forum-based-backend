const articlesRouter = require("express").Router();
const {
  getArticles,
  patchArticle,
  deleteCommentFromArticle,
} = require("../controller/articles-controller");
const {
  getCommentsByArticleId,
  postComment,
} = require("../controller/comments-controller");

articlesRouter.get("/", getArticles);

articlesRouter
.route(`/:article_id`)
.get(getArticles)
.patch(patchArticle);

articlesRouter
  .route(`/:article_id/comments`)
  .get(getCommentsByArticleId)
  .post(postComment)
  

  articlesRouter
    .route(`/:article_id/comments/:comment_id`)
    .delete(deleteCommentFromArticle);

module.exports = articlesRouter;
