const db = require("../db/connection");

function selectTopics() {
    let sqlString = `SELECT * FROM topics`
    // const validColumns = ['description, slug']


  return db.query(sqlString).then(({ rows }) => {
    return rows
  });
}

module.exports = selectTopics;
