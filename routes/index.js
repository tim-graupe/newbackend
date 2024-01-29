var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ user: req.user, isAuth: req.isAuthenticated() });
});
router.post("/register", authController.sign_up_post);

router.post("/login", authController.login);

module.exports = router;
