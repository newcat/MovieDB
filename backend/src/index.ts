import * as cors from "cors";
import * as express from "express";
import * as fuse from "fuse.js";
import * as pg from "pg";

const app = express();
app.use(cors());

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
        let query = "SELECT movie_id, title, genre FROM movies NATURAL JOIN movies_actors NATURAL JOIN actors";
        const conditions: string[] = [];
        const options = (req.query.options as string).split(",");
        const byactor = req.query.byactor === "true" || false;
        const bytitle = req.query.bytitle === "true" || false;

        const addCond = (name: string, q: string) => {
            if (options.indexOf(name) >= 0) {
                if (byactor) { conditions.push(q.replace("$$", "name")); }
                if (bytitle) { conditions.push(q.replace("$$", "title")); }
            }
        };
        addCond("ILIKE", "$$ ILIKE $1");
        addCond("RegEx", "$$ ~* $1");
        addCond("Levenshtein", "levenshtein(lower($$), lower($1)) <= 3");
        addCond("Trigram", "$$ % $1");
        addCond("Fulltext", "$$ @@ $1");
        addCond("Metaphone", "metaphone($$, 6) = metaphone($1, 6)");

        // build the query
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" OR ");
        }
        query += " GROUP BY movie_id";
        console.log(query);

        const qr = await client.query(query, conditions.length > 0 ? [req.query.q] : undefined);
        rows = qr.rows;

        if (options.indexOf("Fuse") >= 0) {
            const f = new fuse(rows, {
                shouldSort: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [ "title" ]
            });
            rows = f.search(req.query.q);
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

app.get("/actors", async (req, res) => {

    try {

        let rows = [];
        let query = "SELECT actor_id, name FROM actors NATURAL JOIN movies_actors NATURAL JOIN movies";
        const conditions: string[] = [];
        const options = (req.query.options as string).split(",");
        const byactor = req.query.byactor === "true" || false;
        const bytitle = req.query.bytitle === "true" || false;

        const addCond = (name: string, q: string) => {
            if (options.indexOf(name) >= 0) {
                if (byactor) { conditions.push(q.replace("$$", "name")); }
                if (bytitle) { conditions.push(q.replace("$$", "title")); }
            }
        };
        addCond("ILIKE", "$$ ILIKE $1");
        addCond("RegEx", "$$ ~* $1");
        addCond("Levenshtein", "levenshtein(lower($$), lower($1)) <= 3");
        addCond("Trigram", "$$ % $1");
        addCond("Fulltext", "$$ @@ $1");
        addCond("Metaphone", "metaphone($$, 6) = metaphone($1, 6)");

        // build the query
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" OR ");
        }
        query += " GROUP BY actor_id";
        console.log(query);

        const qr = await client.query(query, conditions.length > 0 ? [req.query.q] : undefined);
        rows = qr.rows;

        // TODO: Fuse

        res.status(200).json(rows);

    } catch (err) {
        res.status(500).json(err);
    }

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
