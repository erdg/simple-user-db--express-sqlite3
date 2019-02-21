// "/signup"
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3");
const config = require("../common.js").config();
const validator = require("validator");

function signupHandler (req, res) {
   // open db connection
   const db = new sqlite3.Database(config.db_url);
   let em = req.body.em.toLowerCase();
   // validate email address
   if (!validator.isEmail(em)) {
      return res.json({error: "invalid email address"})
   }
   let pw = req.body.pw;
   if (!pw) {
      return res.json({error: "no password provided"})
   }
   // add user to db
   db.run("INSERT INTO users (user_em, user_pw) VALUES (?, ?);", [em, pw], (err) => {
      if (err) {
         // console.log(err.message);
         return res.json({error: "db insert error"});
      }
      res.json({success: `${em} is signed up`});
   })
   db.close();
}

router.post("/", signupHandler);

module.exports = router;
