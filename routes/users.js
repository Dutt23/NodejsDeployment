const express = require("express");
// Initialising the application
const mongoose = require("mongoose");
// importing bcrypt
const bCrypt = require("bcryptjs");
// importing passport
const passport = require("passport");
const router = express.Router();
require("../models/User");
const User = mongoose.model("users");
// login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// resgistration route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Register form post
router.post("/register", (req, res) => {
  const errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Password needs to be atleast 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    //  This is where I did the edit
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already exists");
        res.redirect("/users/register");
      } else {
        // console.log("Enterted else");
        // encrypting password
        // hash is the actually password
        bCrypt.genSalt(10, (err, salt) => {
          // console.log("Enterted bcrypt area");
          bCrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "Registration Sucessfull , Please login"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Login route with passport

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// logout route
router.get("/logout",(req,res)=>{
  req.logout();
  req.flash("success_msg","You have been logged out");
  res.redirect("/users/login");
})
module.exports = router;
