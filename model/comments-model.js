const db = require("../db/connection");

function fetchComments(article_id, order = "desc", sort_by = "created_at") {
  if (Number(article_id) === NaN) {
    return Promise.reject({ status: 400, message: "invalid id type!" });
  }
  let sqlString = `SELECT * FROM comments WHERE article_id=$1 ORDER BY ${sort_by} ${order};`;
  return db.query(sqlString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "id not found!" });
    }
    return rows;
  });
}

module.exports = fetchComments;
