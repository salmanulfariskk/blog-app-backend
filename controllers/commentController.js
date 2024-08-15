const Comment = require("../models/commentModel");
const catchError = require("../utils/catchError");
const AppError = require("../utils/error");

exports.createCommentHandler = catchError(async (req, res) => {
  const { text, postId } = req.body;

  if (!postId) {
    throw new AppError(400, 'Post id not present')
  }

  const comment = await Comment.create({
    content: text,
    post: postId,
    author: req.user
  });

  const data = await comment.populate("author", "-password");


  return res.status(201).json(data);
});
