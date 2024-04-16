const db = require("../db/connection");

function getArticleById(id) {
  let sqlString = `SELECT * FROM articles`;
    if (id) {
      sqlString += ` WHERE article_id=$1;`;
    }

  if(Number(id) === NaN){
    return Promise.reject({status: 400, message: 'invalid id type!'})
  } else {

  return db.query(sqlString, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "id not found!" });
    }
    return rows;
  });
}
}

module.exports = getArticleById;
