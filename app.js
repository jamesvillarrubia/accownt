require("app-module-path").addPath(__dirname);

const express = require("express");
const session = require("express-session");
const parser = require("body-parser");
const Store = require("express-mysql-session");

const config = require("config");

let app = express();

/* Serve Static Files */
app.use("/static", express.static(__dirname + "/static"));

/* Body-Parser */
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

/* Sessions */
const sessionStore = new Store({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    useConnectionPooling: true
});
app.use(session({
    secret: config.keys.session,
    store: sessionStore,
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: false
    }
}));

/* Routes / Controlers */
app.use("/api", require("./controllers/"));
app.get("/", (req, res) => res.sendFile(__dirname + "/views/Home.html"));
app.get("/app/*", (req, res) => res.sendFile(__dirname + "/views/App.html"));

app.listen(config.environment.port, () => {
    console.log("Server running on port", config.environment.port);
});

if (config.environment.runCronJobs)
    require("./cron/start")();