const db = require("../connection");

function selectTopics() {
    let sqlString = `SELECT * FROM topics`
    // const validColumns = ['description, slug']


  return db.query(sqlString).then(({ rows }) => {
    //   console.log(rows);
    // if(rows.length === 0){
    //     return Promise.reject({ status: 404, message: 'path not found!' })
    // }
    return rows
  });
}

module.exports = selectTopics;
