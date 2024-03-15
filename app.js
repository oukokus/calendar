const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "world",
  dateStrings: 'date' 
});

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  // cssファイルの取得
  app.use(express.static("assets"));
  const sql = "select * from sample3";
  
  // ==========ここまでの範囲で書くようにしましょう。==========
  app.post("/", (req, res) => {
    const sql = "INSERT INTO sample3 SET ?";
    con.query(sql, req.body, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.redirect("/");
    });
  });

  app.get("/", (req, res) => {
    const sql = "SELECT 注文者名 FROM world.sample3 ";
    con.query(sql, [req.params.id], function (err, result, fields) {
      if (err) throw err;
      res.render("edit", {
   
      });
    });
  });

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result,
     sample3: result,
        });
    });
});





app.listen(port, () => console.log(`Example app listening on port ${port}!`));
