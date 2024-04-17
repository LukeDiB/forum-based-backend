const db = require("../db/connection");

function selectAllUsers() {
  const sqlString = `SELECT * FROM users`;
  return db.query(sqlString).then(({ rows }) => {
    return rows;
  });
}

module.exports = selectAllUsers;
