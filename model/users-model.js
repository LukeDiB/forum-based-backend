const db = require("../db/connection");

function selectAllUsers() {
  const sqlString = `SELECT * FROM users`;
  return db.query(sqlString).then(({ rows }) => {
    return rows;
  });
}

function selectByUsername(username) {
  const sqlString = `SELECT * FROM users WHERE username=$1`;
  return db.query(sqlString, [username]).then(({rows}) => {
    return rows[0]
  })
}

module.exports = { selectAllUsers, selectByUsername };
