const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const validator = require("email-validator");

exports.sign_up_post = [
  body("firstName", "First Name required!")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("lastName", "Last Name is required!")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("password").trim().isLength({ min: 6 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    let email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(400).json({ error: "Email address already in use." });
    }
    if (!errors.isEmpty() && !email) {
      return;
    }
    if (!errors.isEmpty()) {
      return;
    }
    if (!validator.validate(req.body.email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
      dob: req.body.dob,
      relationship: req.body.relationship,
      politics: req.body.politics,
      college: req.body.college,
      high_school: req.body.high_school,
      home_town: req.body.home_town,
      current_city: req.body.current_city,
      status: "",
    });
    user.save();
    res.json(user);
  },
];

//local login
exports.loginPost = function (req, res) {
  passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/");
    };
};
