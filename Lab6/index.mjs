import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const pool = mysql.createPool({
    host: process.env.DB_HOST || "co28d739i4m2sb7j.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USER || "zkx4filzz52nbyin",
    password: process.env.DB_PASSWORD || "c3f132uxjvixxfoo",
    database: process.env.DB_NAME || "mcdcrw36znhracko",
    connectionLimit: 10,
    waitForConnections: true
});


app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() AS nowTime");
        res.send(`Database connected! ${rows[0].nowTime}`);
    } catch (err) {
        res.send(err.message);
    }
});


app.get("/", (req, res) => {
    res.render("index");
});


app.get("/author/new", (req, res) => {
    res.render("newAuthor", { message: undefined });
});


app.post("/author/new", async (req, res) => {
    try {
        const {
            fName,
            lName,
            dob,
            dod,
            sex,
            profession,
            country,
            portrait,
            biography
        } = req.body;

        const sql = `
      INSERT INTO q_authors
      (firstName, lastName, dob, dod, sex, profession, country, portrait, biography)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const params = [
            fName,
            lName,
            dob || null,
            dod || null,
            sex,
            profession,
            country,
            portrait,
            biography
        ];

        await pool.query(sql, params);
        res.render("newAuthor", { message: "Author added successfully!" });
    } catch (err) {
        res.render("newAuthor", { message: err.message });
    }
});


app.get("/authors", async (req, res) => {
    try {
        const sql = `
      SELECT *
      FROM q_authors
      ORDER BY lastName, firstName
    `;
        const [authors] = await pool.query(sql);
        res.render("authorList", { authors });
    } catch (err) {
        res.send(err.message);
    }
});


app.get("/author/edit", async (req, res) => {
    try {
        const authorId = req.query.authorId;

        const sql = `
      SELECT *,
             DATE_FORMAT(dob, '%Y-%m-%d') AS dobISO,
             DATE_FORMAT(dod, '%Y-%m-%d') AS dodISO
      FROM q_authors
      WHERE authorId = ?
    `;

        const [authorInfo] = await pool.query(sql, [authorId]);
        res.render("editAuthor", { authorInfo });
    } catch (err) {
        res.send(err.message);
    }
});


app.post("/author/edit", async (req, res) => {
    try {
        const sql = `
      UPDATE q_authors
      SET firstName = ?,
          lastName = ?,
          dob = ?,
          dod = ?,
          sex = ?,
          profession = ?,
          country = ?,
          portrait = ?,
          biography = ?
      WHERE authorId = ?
    `;

        const params = [
            req.body.fName,
            req.body.lName,
            req.body.dob || null,
            req.body.dod || null,
            req.body.sex,
            req.body.profession,
            req.body.country,
            req.body.portrait,
            req.body.biography,
            req.body.authorId
        ];

        await pool.query(sql, params);
        res.redirect("/authors");
    } catch (err) {
        res.send(err.message);
    }
});


app.get("/author/delete", async (req, res) => {
    try {
        const authorId = req.query.authorId;

        // delete quotes by this author first
        await pool.query("DELETE FROM q_quotes WHERE authorId = ?", [authorId]);
        await pool.query("DELETE FROM q_authors WHERE authorId = ?", [authorId]);

        res.redirect("/authors");
    } catch (err) {
        res.send(err.message);
    }
});


app.get("/quote/new", async (req, res) => {
    try {
        const [authors] = await pool.query(`
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName, firstName
    `);

        res.render("newQuote", { authors, message: undefined });
    } catch (err) {
        res.send(err.message);
    }
});


app.post("/quote/new", async (req, res) => {
    try {
        const sql = `
      INSERT INTO q_quotes (quote, authorId, category, likes)
      VALUES (?, ?, ?, ?)
    `;

        const params = [
            req.body.quote,
            req.body.authorId,
            req.body.category,
            req.body.likes || 0
        ];

        await pool.query(sql, params);

        const [authors] = await pool.query(`
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName, firstName
    `);

        res.render("newQuote", {
            authors,
            message: "Quote added successfully!"
        });
    } catch (err) {
        res.send(err.message);
    }
});


app.get("/quotes", async (req, res) => {
    try {
        const sql = `
      SELECT q.quoteId,
             q.quote,
             q.authorId,
             q.category,
             q.likes,
             a.firstName,
             a.lastName
      FROM q_quotes q
      JOIN q_authors a ON q.authorId = a.authorId
      ORDER BY q.quoteId DESC
    `;

        const [quotes] = await pool.query(sql);
        res.render("quoteList", { quotes });
    } catch (err) {
        res.send(err.message);
    }
});


app.get("/quote/edit", async (req, res) => {
    try {
        const quoteId = req.query.quoteId;

        const [quoteInfo] = await pool.query(`
      SELECT *
      FROM q_quotes
      WHERE quoteId = ?
    `, [quoteId]);

        const [authors] = await pool.query(`
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName, firstName
    `);

        res.render("editQuote", { quoteInfo, authors });
    } catch (err) {
        res.send(err.message);
    }
});


app.post("/quote/edit", async (req, res) => {
    try {
        const sql = `
      UPDATE q_quotes
      SET quote = ?,
          authorId = ?,
          category = ?,
          likes = ?
      WHERE quoteId = ?
    `;

        const params = [
            req.body.quote,
            req.body.authorId,
            req.body.category,
            req.body.likes || 0,
            req.body.quoteId
        ];

        await pool.query(sql, params);
        res.redirect("/quotes");
    } catch (err) {
        res.send(err.message);
    }
});


app.get("/quote/delete", async (req, res) => {
    try {
        const quoteId = req.query.quoteId;
        await pool.query("DELETE FROM q_quotes WHERE quoteId = ?", [quoteId]);
        res.redirect("/quotes");
    } catch (err) {
        res.send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});