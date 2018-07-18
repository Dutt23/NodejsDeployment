// Basically for importing
const express = require("express");
// Initialising express-handlebars
const exphbs = require("express-handlebars");
// Initialising the application
const mongoose = require("mongoose");
// Importing body-parser
const bodyParser = require("body-parser");
// Importing method-ovveride
const methodOverride = require("method-override");
// Importing connect-flash
const flash = require("connect-flash");
// Passport
const passport = require("passport");
// Importing session
const session = require("express-session");
// Path module , core module. Used to redirect paths
const path = require("path");
// DB config
const db = require("./config/database");
// Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Passport config
require("./config/passport")(passport);
const app = express();
// Static folder for images and stuff
app.use(express.static(path.join(__dirname, "public")));
// Middleware for handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

// Middleware for body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.set(bodyParser.json());
// Middleware for method-override , to make a put request
app.use(methodOverride("_method"));
// Middlewatre for express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
    // check what this is for
    // cookie: { secure: true }
  })
);

// middleware for passport
app.use(passport.initialize());
app.use(passport.session());
// Middleware for flash
app.use(flash());
//Connect to mongoose
// Returns a promise , callbacks can also be used
mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    
    console.log("Mongo Connected");
  })
  .catch(() => {
    console.log("Error");
  });

// Making a middleware
// Global variables
app.use((req, res, next) => {
  //   console.log(Date.now());

  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  //   Required in every middleware to tell it to move to the next middleware
  next();
});

// Use routes
app.use("/ideas", ideas);
app.use("/users", users);

// Viewing all ideas
// Fetches everything from the db

app.get("/", (req, res) => {
  const title = `Welcome ${req.user.name}`;
  res.render("index", {
    title: title
  });
  //   res.send(req.name);
  //   res.send(req.name);
  //   console.log(req.name);
});

// Second route
app.get("/about", (req, res) => {
  res.render("about");
});
// For deployment
const port = process.env.PORT || 5000;
app.listen(port, () => {
  // Back ticks are used , so that we can use variables without concating them.
  console.log(`Server started on port ${port}`);
});
