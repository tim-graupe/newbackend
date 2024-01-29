var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("./models/newUserModel");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.mongoDB);
}
var indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
var app = express();

// view engine setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const port = 4000;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
app.use(
  require("express-session")({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.secret,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!existingUser) {
          console.log("User not found! Creating user...");
          const newUser = new User({
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profile_pic: profile.photos[0].value,
            password: "",
          });

          await newUser.save();
          console.log("user created: ", newUser);
          return done(null, newUser);
        } else {
          console.log("user found", existingUser);
          return done(null, existingUser);
        }
      } catch (err) {
        console.error("Error:", err);
        return done(err, null);
      }
    }
  )
);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      // Change 'username' to 'email' here
      try {
        const user = await User.findOne({ email: email }); // Use 'email' here

        if (!user) {
          console.log("Incorrect email.");
          return done(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          console.log("Incorrect password.", password, user.password);
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        console.log("err"); // Fix the logging of the error
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);
app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/", postRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

module.exports = app;
