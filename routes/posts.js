const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

//Routes that handle actions related to posts and comments
//new text post
router.post("/user/:id/new_post", postsController.newTextPost);

// new image post
router.post("/user/:id/new_img", postsController.newImgPost);

//get user's post
router.get("/user/:id/posts", postsController.getPosts);

//get friends posts for dashboard
router.get("/getFriendsPosts/:id", postsController.getFriendsPosts);

//like post
router.post("/likePost/:id", postsController.addLikeToPost);

//delete post
router.delete("/delete/post/:id", postsController.deletePost);

//new comment
router.post("/commentOnPost/:id", postsController.newComment);

module.exports = router;
