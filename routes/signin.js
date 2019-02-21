// "/signin"
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3");
const config = require("../common.js").config();
const validator = require("validator");

function signinHandler (req, res) {
   // open db connection
   const db = new sqlite3.Database(config.db_url);
   let em = req.body.em.toLowerCase();
   // reject invalid email addresses
   if (!validator.isEmail(em)) {
      return res.json({error: "invalid email address"})
   }
   let pw = req.body.pw;
   if (!pw) {
      return res.json({error: "no password provided"})
   }
   // console.log("req.body", em, pw);
   db.get("SELECT user_id, user_em, user_pw FROM users WHERE user_em = (?)", [em], (err, row) => {
      // if (err) console.log(err.message);
      if (!row) {
         return res.json({error: "user not in db"})
      }
      if (pw !== row.user_pw) {
         return res.json({error: "incorrect password"})
      };
      res.json({
         id: row.user_id,
         em: row.user_em,
         pw: row.user_pw
      })
   })
   db.close();
}

router.post("/", signinHandler);

module.exports = router;
