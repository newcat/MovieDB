import * as express from "express";
import * as fuse from "fuse.js";
import * as pg from "pg";

const app = express();

const client = new pg.Client({
    host: "localhost",
    database: "vorlesung",
    user: "student",
    password: "student"
});
client.connect()
    .then(() => console.log("Connected to database."))
    .catch((err) => console.log("Failed to connect to db: " + err));

app.get("/movies", async (req, res) => {

    try {

        let rows = [];

        if (req.query.searchactor) {
            const qr = await client.query(`
                SELECT movie_id, title, genre FROM movies
                NATURAL JOIN movies_actors
                NATURAL JOIN actors
                WHERE metaphone(name, 6) = metaphone($1, 6);
            `, [req.query.searchactor]);
            rows = qr.rows;
        } else if (req.query.searchtitle) {
            const qr = await client.query(`
                SELECT movie_id, title, genre FROM movies
                WHERE metaphone(title, 6) = metaphone($1, 6);
            `, [req.query.searchtitle]);
            rows = qr.rows;
        } else {
            const qr = await client.query("SELECT movie_id, title, genre FROM movies");
            rows = qr.rows;
        }

        if (req.query.searchfuzzy) {
            const f = new fuse(rows, {
                shouldSort: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [ "title" ]
            });
            rows = f.search(req.query.searchfuzzy);
        }

        res.status(200).json(rows);

    } catch (err) {
        res.status(500).json(err);
    }

});

app.get("/movies/:id", async (req, res) => {

    let qr = await client.query("SELECT * FROM movies WHERE movie_id = $1", [req.params.id]);
    if (qr.rowCount <= 0) { return res.status(404).end(); }

    const ret = qr.rows[0];
    qr = await client.query(`
        SELECT actor_id, name FROM actors
        NATURAL JOIN movies_actors
        WHERE movie_id = $1
    `, [req.params.id]);
    ret.actors = qr.rows;

    res.status(200).json(ret);

});

app.get("/actors/:id", async (req, res) => {

    let qr = await client.query("SELECT * FROM actors WHERE actor_id = $1", [req.params.id]);
    if (qr.rowCount <= 0) { return res.status(404).end(); }

    const ret = qr.rows[0];
    qr = await client.query(`
        SELECT movie_id, title FROM movies
        NATURAL JOIN movies_actors
        WHERE actor_id = $1
    `, [req.params.id]);
    ret.movies = qr.rows;

    res.status(200).json(ret);

});

app.listen(8050);
