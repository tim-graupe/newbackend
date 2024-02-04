var express = require("express");
const usersController = require("../controllers/usersController");
var router = express.Router();

//get user
router.get("/user/:id", usersController.getUser);

//edit user bio
router.put("/user/:id/bio", usersController.editUserInfo);

//send friend reqs
router.post("/sendFriendReq/:id", usersController.sendFriendReq);

// //get friend reqs
router.get("/getFriendReqs/:id", usersController.getFriendReqs);

// //reject friend req
router.post("/rejectFriendReq/:id", usersController.rejectFriendReq);

// //accept friend req
router.post("/acceptFriendReq/:id", usersController.acceptFriendReq);

// //delete friend
router.post("/deleteFriend/:id", usersController.deleteFriend);

// //get friends to view  user's profile
router.get("/getFriends/:id", usersController.getFriends);

// //get friends list for dashboard
router.get("/getFriends/", usersController.getFriendsList);

// //create new group
router.post("/newGroup", usersController.createGroup);

// //show group
router.get("/group/:id", usersController.getGroup);

// //show groups for profile
router.get("/user/:id/groups", usersController.getGroupsUserIsIn);

// //search user
router.get("/search", usersController.findUser);

module.exports = router;
