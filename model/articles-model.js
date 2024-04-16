const db = require("../db/connection");

function getArticleById(id) {
  let sqlString = `SELECT * FROM articles`;
  if (id) {
    sqlString += ` WHERE article_id=$1;`;
  }
  if (Number(id) === NaN) {
    return Promise.reject({ status: 400, message: "invalid id type!" });
  } else {
    return db.query(sqlString, [id]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "id not found!" });
      }
      return rows;
    });
  }
}

function getAllArticles(order = "desc", sort_by = "created_at") {
  const validColumns = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "invalid query type!" });
  }

  if (!order === "asc" || !order === "desc") {
    return Promise.reject({ status: 400, message: "bad order!" });
  }

  let sqlString = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(sqlString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "path not found!" });
    }
    return rows;
  });
}
module.exports = { getArticleById, getAllArticles };
