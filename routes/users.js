var express = require("express");
const postsController = require("../controllers/postsController");
var router = express.Router();

//get user
router.get("/user/:id", postsController.getUser);

//send friend reqs
router.post("/sendFriendReq/:id", postsController.sendFriendReq);

//get friend reqs
router.get("/getFriendReqs/:id", postsController.getFriendReqs);

//reject friend req
router.post("/acceptFriendReq/:id", postsController.rejectFriendReq);

//accept friend req
router.post("/acceptFriendReq/:id", postsController.acceptFriendReq);

//delete friend
router.post("/deleteFriend/:id", postsController.deleteFriend);

//get friends to view  user's profile
router.get("/getFriends/:id", postsController.getFriends);

//get friends posts for dashboard
router.get("/getFriendsPosts/:id", postsController.getFriendsPosts);

//get friends list for dashboard
router.get("/getFriends/", postsController.getFriendsList);

//create new group
router.post("/newGroup", postsController.createGroup);

//show group
router.get("/group/:id", postsController.getGroup);

//show groups for profile
router.get("/user/:id/groups", postsController.getGroupsUserIsIn);

//search user
router.get("/search", postsController.findUser);

module.exports = router;
