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
});

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  // cssファイルの取得
  app.use(express.static("assets"));
  const sql = "select * from world.sample3";
  
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
    const sql = "SELECT 注文日付 FROM world.sample3 ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
      if (err) throw err;
      res.render("edit", {
        use: result,
      });
    });
  });
  


  app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.ejs"));
  });

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result,
sample3: result,
        
     
        });
    });
});

app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM sample3 WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      user: result,
    });
  });
});

app.post("/update/:id", (req, res) => {
  const sql = "UPDATE sample3 SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.get("/:filter", (req, res) => {
  // ソート、絞り込みを選択された場合の処理
  let order = ""
  let search = ""
    let orderQuery = ""
    let searchQuery = ""
    let sample3Org = []
    const filter = req.params.filter.split("+")

    // ソート、絞り込みの選択肢が格納されている分だけ処理繰り返し
    filter.forEach((elem) => {
        if (elem.indexOf("order") > -1) {
          // 「order=rating:asc」という形から=の後の記述のみ取得する
            const selectOrder = elem.slice(elem.indexOf("=") + 1)
            if (elem.indexOf("rating") > -1) {
                // 「asc」という形のみ取得する。
                order = selectOrder.slice(selectOrder.indexOf(":") + 1)
                if (order !== "base") orderQuery = `ORDER BY rating ${order}`
            }
            else if (selectOrder === "base") order = "base"
        } else if (elem.indexOf("search") > -1) {
            // 「search=rating:1」という形から=の後の記述のみ取得する
            const selectSearch = elem.slice(elem.indexOf("=") + 1)
            if (elem.indexOf("rating") > -1) {
                // 「1」という形のみ取得する。
                search = selectSearch.slice(selectSearch.indexOf(":") + 1)
                if (search !== "base") searchQuery = `WHERE rating = ${search}`
            }
            else if (selectSearch === "base") search = "base"
        }
    });
    // グラフ描画用に全てのユーザー情報も取得しておく
    let sql = `SELECT * FROM sample3`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        worldOrg = result;
    });
    // 検索結果を反映した情報を取得
    sql = `SELECT * FROM sample3 ${searchQuery} ${orderQuery}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        // ソートされたユーザー情報と順番,絞り込みの情報を返す
        res.render("index", {
            worldOrg: worldOrg, //全てのユーザー情報
            filteredsample3: result, //
            order: order, // asc/desc
            search: search //数字
        });
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
