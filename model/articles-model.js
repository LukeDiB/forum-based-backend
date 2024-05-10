const db = require("../db/connection");
const articles = require("../db/data/development-data/articles");
const topics = require("../db/data/development-data/topics");
const commentsData = require("../db/data/development-data/comments");

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
  let validTopics = [];
  let topicsWithArticles = [];

  articles.forEach((article) => {
    if (!topicsWithArticles.includes(article.topic)) {
      topicsWithArticles.push(article.topic);
    }
  });

  topics.forEach((topic) => {
    if (!validTopics.includes(topic.slug)) {
      validTopics.push(topic.slug);
    }
  });

  if (validTopics.includes(topic) && !topicsWithArticles.includes(topic)) {
    return Promise.reject({ status: 204, message: "no content found!" });
  }

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "invalid query type!" });
  }

  if (topic !== undefined) {
    let sqlString = `SELECT * FROM articles WHERE topic=$1;`;
    return db.query(sqlString, [topic]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "data not found!" });
      }
      return rows;
    });
  } else {
    let sqlString = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
    return db.query(sqlString).then(({ rows }) => {
      return rows;
    });
  }
}

function updateArticleById(id, inc_votes) {
  const newVote = inc_votes;
  const sqlString = `UPDATE articles SET votes=votes+$1 WHERE article_id=$2;`;

  if (id > articles.length) {
    return Promise.reject({ status: 404, message: "article not found!" });
  }

  return db.query(sqlString, [newVote, id]).then((rows) => {
    return rows;
  });
}

function removeComment(comment_id) {
  if (comment_id > commentsData.length) {
    return Promise.reject({ status: 404, message: "id not found!" });
  }

  const sqlString = `DELETE FROM comments WHERE comment_id=$1`;
  return db.query(sqlString, [comment_id]);
}

module.exports = { selectArticleById, selectAllArticles, updateArticleById, removeComment };
