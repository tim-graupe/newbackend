const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

//Routes that handle actions related to posts and comments
//new text post
router.post("/user/:id/new_post", postsController.newTextPost);

//get user's post
router.get("/user/:id/posts", postsController.getPosts);

//like post
router.post("/likePost/:id", postsController.addLikeToPost);

//new comment
router.post("/commentOnPost/:id", postsController.newComment);

module.exports = router;
