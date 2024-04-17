const db = require("../db/connection");
const users = require("../db/data/test-data/users");
const commentsData = require('../db/data/test-data/comments')
let authors = [];
users.forEach((user) => {
  authors.push(user.username);
});

function fetchComments(article_id, order = "desc", sort_by = "created_at") {
  if (Number(article_id) === NaN) {
    return Promise.reject({ status: 400, message: "invalid input!" });
  }
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
  if(newComment.body === ''){
    return Promise.reject({status: 400, message: 'body must be filled!'})
  }
  const sqlString = `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  return db
    .query(sqlString, [
      newComment.body,
      newComment.votes,
      newComment.author,
      newComment.article_id,
      newComment.created_at,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
}

function removeCommentById(comment_id){

  if (Number(comment_id) === NaN) {
    return Promise.reject({ status: 400, message: "invalid input!" });
  }

  if (comment_id > commentsData.length) {
    return Promise.reject({ status: 404, message: "id not found!" });
  }




  const sqlString = `DELETE FROM comments WHERE comment_id=$1`;
  return db.query(sqlString, [comment_id])

}

module.exports = { fetchComments, insertComment, removeCommentById };
