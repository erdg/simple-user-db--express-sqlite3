const request = require("supertest");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const config = require("../common.js").config();

describe("SERVER TEST", function () {
   var server, db;
   
   before(function () {
      // fresh server for each test run
      delete require.cache[require.resolve("../server.js")];
      server = require("../server.js");
      // open db
      db = new sqlite3.Database(config.db_url, (err) => {
         if (err) throw err;
         // console.info("test db created")
      })
      db.serialize(() => {
         // create users table
         let create_stmt = `CREATE TABLE IF NOT EXISTS users (
                        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_em text NOT NULL UNIQUE,
                        user_pw text NOT NULL
                     );`;
         db.run(create_stmt, [], (err) => {
            // if (err) console.log(err.message);
         })
         // insert test user
         let insert_stmt = `INSERT INTO users (user_em, user_pw) VALUES ("randy.randleman@email.com", "randyiscool")`;
         db.run(insert_stmt, [], (err) => {
            // if (err) console.log(err.message);
         })
      })
   })

   after(function (done) {
      db.close();
      server.close(done);
      fs.unlink(config.db_url, (err) => {
         if (err) return console.errorr(err)
         // console.info("test db deleted");
      })
   })

   describe("GET /", function () {
      it("responds with correct db connection url", function (done) {
         request(server)
            .get("/")
            .expect(200, "database connection url -- ./test.db", done)
      })
   })

   describe("POST /signin", function () {
      it("responds with json object of user data from db", function (done) {
         request(server).post("/signin")
            .set("content-type", "application/json")
            .send({em: "randy.randleman@email.com", pw: "randyiscool"})
            .expect(200, {id: 1, em: "randy.randleman@email.com", pw: "randyiscool"}, done)
      })
      it("converts email to lowercase", function (done) {
         request(server).post("/signin")
            .set("content-type", "application/json")
            .send({em: "RaNdY.RaNdLeMaN@EmAiL.CoM", pw: "randyiscool"})
            .expect(200, {id: 1, em: "randy.randleman@email.com", pw: "randyiscool"}, done)
      })
      it("rejects invalid email addresses", function (done) {
         request(server).post("/signin")
            .set("content-type", "application/json")
            .send({em: "this is not an email", pw: "nice try"})
            .expect(200, {error: "invalid email address"}, done)
      })
      it("rejects incorrect passwords", function (done) {
         request(server).post("/signin")
            .set("content-type", "application/json")
            .send({em: "randy.randleman@email.com", pw: "randyisnotcool"})
            .expect(200, {error: "incorrect password"}, done)
      })
      it("rejects signin attempts without password", function (done) {
         request(server).post("/signin")
            .set("content-type", "application/json")
            .send({em: "randy.randleman@email.com", pw: ""})
            .expect(200, {error: "no password provided"}, done)
      })
      it("rejects users not stored in db", function (done) {
         request(server).post("/signin")
            .set("content-type", "application/json")
            .send({em: "schmandy.schmandleman@email.com", pw: "schmandyisnotcool"})
            .expect(200, {error: "user not in db"}, done)
      })
   })

   describe("POST /signup", function () {
      it("rejects invalid email addresses", function (done) {
         request(server).post("/signup")
            .set("content-type", "application/json")
            .send({em: "this is not an email address", pw: "nice try"})
            .expect(200, {error: "invalid email address"}, done)
      })
      it("rejects signup attempts without a password", function (done) {
         request(server).post("/signup")
            .set("content-type", "application/json")
            .send({em: "roger.rogerson@email.com", pw: ""})
            .expect(200, {error: "no password provided"}, done)
      })
      it("rejects signup with email addresses already in the database", function (done) {
         request(server).post("/signup")
            .set("content-type", "application/json")
            .send({em: "randy.randleman@email.com", pw: "randyiscool"})
            .expect(200, {error: "db insert error"}, done)
      })
      it("accepts new users", function (done) {
         request(server).post("/signup")
            .set("content-type", "application/json")
            .send({em: "peter.peterson@email.com", pw: "peteriscool"})
            .expect(200, {success: "peter.peterson@email.com is signed up"}, done)
      })
      it("converts email addresses to lowercase", function (done) {
         request(server).post("/signup")
            .set("content-type", "application/json")
            .send({em: "ROGER.ROGERSON@EMAIL.COM", pw: "rogeriscool"})
            .expect(200, {success: "roger.rogerson@email.com is signed up"}, done)
      })
   })

})
