const Post = require("../models/newPostModel");
const Comment = require("../models/commentModel");
const User = require("../models/newUserModel");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({ storage, fileFilter });

exports.newImgPost = [
  upload.single("profile_pic"),
  async function (req, res) {
    try {
      let user = await User.findById(req.user._id);
      const pic = req.file.filename;

      let newPost = new Post({
        likes: [],
        date_posted: Date.now(),
        user: user._id,
        content: "pic",
        type: "image",
        pic: pic,
        profile: user._id,
      });
      await newPost.save();
      res.status(200).json({ success: true }); // Send a success response if everything is fine
    } catch (err) {
      console.error("Error during image upload:", err); // Log the actual error
      res.status(500).json({ error: "error found", err });
    }
  },
];

exports.getPosts = async function (req, res, next) {
  console.log(req.params.id);
  try {
    let posts = await Post.find({ profile: req.params.id })
      .populate("user profile likes")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: ["firstName", "lastName"],
        },
      })
      .exec();

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "error found!", err });
  }
};

exports.getFriendsPosts = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "error" });
    }
    const posts = await Post.find({
      $or: [
        { user: { $in: user.friends } },
        { profile: { $in: user.friends } },
      ],
    })
      .populate("user profile likes")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: ["firstName", "lastName"],
        },
      })
      .exec();

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};

exports.addLikeToPost = async function (req, res, next) {
  try {
    const loggedInUserID = req.user._id;
    const postToBeLikedID = req.body.postId;

    // Check if the post to be liked exists
    const postToBeLiked = await Post.findOne({ _id: postToBeLikedID });

    if (!postToBeLiked) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (postToBeLiked.likes.includes(loggedInUserID)) {
      return res.status(400).json({ liked: true });
    }

    // Update the like count for the post by adding loggedInUserID to the likes array
    await Post.updateOne(
      { _id: postToBeLikedID },
      {
        $addToSet: { likes: loggedInUserID },
      }
    );

    res.status(200).json({ message: "Like sent successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.newTextPost = async function (req, res, next) {
  try {
    let user = await User.findById(req.user._id);
    let newPost = new Post({
      content: req.body.content,
      profile: req.body.profile,
      likes: [],
      date_posted: Date.now(),
      user: user._id,
      type: "post",
    });
    await newPost.save();
  } catch (err) {
    res.status(500).json({ error: "error found", err });
  }
};
//leave comment reply on a post
exports.newComment = async function (req, res, next) {
  try {
    const user = req.user;
    const postId = req.body.postId;
    const commentText = req.body.comment;

    // Create a new comment
    const newComment = new Comment({
      comment: commentText,
      likes: [],
      date_posted: Date.now(),
      user: user._id,
      pic: user.profile_pic,
    });

    // Save the new comment
    await newComment.save();

    // Find the post by its ID and push the new comment to its comments array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment },
      },
      { new: true } // Return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Comment sent successfully!" });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: "Error occurred while creating a comment" });
  }
};

exports.deletePost = async function (req, res, next) {
  try {
    await Post.deleteOne({ _id: req.params.id });
    return res.status(200).json({ msg: "Post successfully deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
