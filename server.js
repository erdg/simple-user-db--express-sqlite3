const express = require("express");
const sqlite3 = require("sqlite3");
const config = require("./common.js").config();

// routes
const signinRouter = require("./routes/signin.js");
const signupRouter = require("./routes/signup.js");

// open db connection
// const db = new sqlite3.Database(config.db_url);
// CREATE TABLE IF NOT EXISTS users
// if NODE_ENV = test, add user for testing

// define routes

const app = express();
app.use(express.json());
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);

// TODO - move to routes/
app.get("/", (req, res) => {
   res.send(`database connection url -- ${config.db_url}`)
})

// app.get("/user/:id", (req, res) => {
//    // res.send("Logged in as user ${user_id} with email ${user_email}
// })

// app.listen
const server = app.listen(3001);
module.exports = server;
