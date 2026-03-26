import express from "express";
import mysql from "mysql2/promise";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const conn = mysql.createPool({
    host: process.env.DB_HOST || "co28d739i4m2sb7j.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USER || "zkx4filzz52nbyin",
    password: process.env.DB_PASSWORD || "c3f132uxjvixxfoo",
    database: process.env.DB_NAME || "mcdcrw36znhracko",
    connectionLimit: 10,
    waitForConnections: true
});

app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await conn.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.get("/", async (req, res) => {
    try {
        const [authors] = await conn.query(
            "SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName"
        );

        const [categories] = await conn.query(
            "SELECT DISTINCT category FROM q_quotes ORDER BY category"
        );

        res.render("index", { authors, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.get("/searchByKeyword", async (req, res) => {
    try {
        let keyword = req.query.keyword;

        let sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE quote LIKE ?
    `;

        let [rows] = await conn.query(sql, [`%${keyword}%`]);
        res.render("results", { quotes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.get("/searchByAuthor", async (req, res) => {
    try {
        let authorId = req.query.authorId;

        let sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE authorId = ?
    `;

        let [rows] = await conn.query(sql, [authorId]);
        res.render("results", { quotes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.get("/searchByCategory", async (req, res) => {
    try {
        let category = req.query.category;

        let sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE category = ?
    `;

        let [rows] = await conn.query(sql, [category]);
        res.render("results", { quotes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.get("/searchByLikes", async (req, res) => {
    try {
        let min = req.query.minLikes;
        let max = req.query.maxLikes;

        let sql = `
      SELECT authorId, firstName, lastName, quote, likes
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE likes BETWEEN ? AND ?
      ORDER BY likes DESC
    `;

        let [rows] = await conn.query(sql, [min, max]);
        res.render("results", { quotes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.get("/api/author/:id", async (req, res) => {
    try {
        let id = req.params.id;

        let sql = "SELECT * FROM q_authors WHERE authorId = ?";
        let [rows] = await conn.query(sql, [id]);

        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});