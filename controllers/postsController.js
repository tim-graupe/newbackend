const Post = require("../models/newPostModel");
const Comment = require("../models/commentModel");
const { ObjectId } = require("mongodb");

exports.getPosts = async function (req, res, next) {
  try {
    let posts = await Post.find({ user: req.params.id })
      .populate("user poster likes")
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
    // Fetch the user whose profile the post will be made to
    let userProfileOwner = await User.findById(req.params.id);

    // Fetch the logged-in user (the one making the post)
    let loggedInUser = await User.findById(req.user._id);

    let newPost = new Post({
      content: req.body.content,
      poster: loggedInUser,
      likes: [],
      datePosted: Date.now(),
      userProfileOwnerId: userProfileOwner._id,
      type: "post",
    });

    await newPost.save();
  } catch (err) {
    res.status(500).json({ error: "Error encountered", err });
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
