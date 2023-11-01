const mysql = require("mysql");
const mycon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "onlineexam",
  });
  mycon.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL database: ", err);
    } else {
      console.log("Connected to MySQL database");
    }
  });
  async function query(myquery) {
    mycon.query(myquery, (err, results) => {
      if (err) {
        return err;
      } else {
        return results;
      }
    });
  }
  module.exports = {
    mycon:mycon,
    query:query
  }