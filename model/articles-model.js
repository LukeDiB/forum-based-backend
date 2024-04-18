const db = require("../db/connection");
const articles = require('../db/data/test-data/articles')

function selectArticleById(id) {
  let sqlString = `SELECT articles.article_id, articles.title, articles.body, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;`;

  return db.query(sqlString, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "id not found!" });
    }
    return rows[0];
  });
}


function selectAllArticles(order = "desc", sort_by = "created_at", topic) {
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
  

  if (topic !== undefined) {
    let sqlString = `SELECT * FROM articles WHERE topic=$1;`;
    return db.query(sqlString, [topic]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "path not found!" });
    }
    return rows;
  })
  } else {
  let sqlString = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  return db.query(sqlString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "path not found!" });
    }
    return rows;
  });
  }
  
}

function updateArticleById(id, inc_votes) {
  const newVote = inc_votes;
  const sqlString = `UPDATE articles SET votes=votes+$1 WHERE article_id=$2;`;

  if(id > articles.length){
    return Promise.reject({ status: 404, message: "article not found!" });
  }

  return db.query(sqlString, [newVote, id]).then((rows) => {
    return rows;
  });
}




module.exports = { selectArticleById, selectAllArticles, updateArticleById};
