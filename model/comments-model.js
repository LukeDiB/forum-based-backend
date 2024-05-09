const db = require("../db/connection");
const users = require("../db/data/development-data/users");
const commentsData = require("../db/data/development-data/comments");
let authors = [];

users.forEach((user) => {
  authors.push(user.username);
});

function fetchComments(article_id, order = "desc", sort_by = "created_at") {
  let sqlString = `SELECT * FROM comments WHERE article_id=$1 ORDER BY ${sort_by} ${order};`;
  return db.query(sqlString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "id not found!" });
    }
    return rows;
  });
}

function insertComment(newComment) {

  if (!authors.includes(newComment.author)) {
    return Promise.reject({ status: 404, message: "user not found!" });
  }
  if (newComment.body === "") {
    return Promise.reject({ status: 400, message: "body must be filled!" });
  }

  
  const sqlString = `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`;
  return db
    .query(sqlString, [
      newComment.body,
      newComment.article_id,
      newComment.author
    ])
    .then(({ rows }) => {
      return rows[0];
    });
}

function selectCommentById(comment_id) {
  const sqlString = `SELECT * FROM comments WHERE comment_id=$1`;
  return db.query(sqlString, [comment_id]).then(({ rows }) => {
    return rows[0];
  });
}

function removeCommentById(comment_id) {
  if (comment_id > commentsData.length) {
    return Promise.reject({ status: 404, message: "id not found!" });
  }

  const sqlString = `DELETE FROM comments WHERE comment_id=$1`;
  return db.query(sqlString, [comment_id]);
}

function patchCommentById(comment_id, inc_votes) {
  const sqlString = `UPDATE comments SET votes=votes+$1 WHERE comment_id=$2;`;

  if (comment_id > commentsData.length) {
    return Promise.reject({ status: 404, message: "comment not found!" });
  }

  return db.query(sqlString, [inc_votes, comment_id]).then((rows) => {
    return rows;
  });
}

module.exports = {
  fetchComments,
  insertComment,
  removeCommentById,
  patchCommentById,
  selectCommentById,
};
