const express = require("express");
// Initialising the application
const mongoose = require("mongoose");
const router = express.Router();
// Load helper
const { ensureAuthenticated } = require("../helpers/auth");

//   Load idea model
require("../models/idea");
const idea = mongoose.model("ideas");

router.get("/", ensureAuthenticated, (req, res) => {
  idea
    .find({
      user: req.user.id
    })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Creating different routes

// Add idea form
router.get("/add", ensureAuthenticated, (req, res) => {
  // console.log("Inside");
  res.render("ideas/add");
});

// Edit idea form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  idea
    .findOne({
      _id: req.params.id
    })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash("error_msg", "Not authorised");
        res.redirect("/ideas");
      } else {
        res.render("ideas/edit", {
          idea: idea
        });
      }
    });
});
// After the form has been submitted
// To process what has been sent a third party named body-parser is required
router.post("/", ensureAuthenticated, (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
    // console.log("Entered title error");
  }

  if (!req.body.details) {
    errors.push({ text: "Please add details" });
    // console.log("Entered details error");
  }
  // Checks if no characters are entered in the area

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new idea(newUser).save().then(idea => {
      req.flash("success_msg", "Video idea added");
      res.redirect("/ideas");
    });
  }
});
// Catching edit request route
router.put("/:id", ensureAuthenticated, (req, res) => {
  idea
    .findOne({
      _id: req.params.id
    })
    .then(idea => {
      // New values
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea
        .save()
        .then(idea => {
          res.redirect("/ideas");
        })
        .catch(() => {
          console.log(err);
        });
    });
});

// Catching delete request route
router.delete("/:id", ensureAuthenticated, (req, res) => {
  idea
    .remove({
      _id: req.params.id
    })
    .then(() => {
      req.flash("success_msg", "Video idea removed");
      res.redirect("/ideas");
      //   console.log(req.params.id);
    })
    .catch(() => {
      console.log(err);
    });
});
module.exports = router;
