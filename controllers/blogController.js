const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const catchError = require("../utils/catchError");
const { handleUpload } = require("../utils/cloudinary");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const AppError = require("../utils/error");

const addBlog = catchError(async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;
  console.log(file);

  if (!file) {
    throw new AppError(400, "Please upload a featured image.");
  }

  if (!title || !content) {
    throw new AppError(400, "All fields are required");
  }

  let photoUrl;
  const clRes = await handleUpload(file.buffer);

  photoUrl = clRes.secure_url;

  const blog = await Blog.create({
    title: title,
    content: content,
    photo: photoUrl,
    author: req.user,
  });

  const blogData = blog.populate("author", "-password");

  return res
    .status(201)
    .json({ message: "Blog successfully added", blogData: blogData });
});

const getBlogs = catchError(async (req, res) => {
  const blogs = await Blog.find({})
    .sort({ createdAt: -1 })
    .populate("author", "-password");
  return res.status(200).json(blogs);
});

const getSingleBlog = catchError(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID format");
  }

  const post = await Blog.findById(id).populate("author", "-password");

  if (!post) {
    throw new AppError(404, "Blog not found");
  }

  const commentCount = await Comment.countDocuments({ post: post._id });

  const comments = await Comment.find({ post: post._id })
    .sort({ createdAt: -1 })
    .populate("author", "-password");

  return res.status(200).json({ post, comments, commentCount });
});

const getEditPost = catchError(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID format");
  }

  const post = await Blog.findById(id);

  if (!post) {
    throw new AppError(404, "Post not found");
  }

  return res.status(200).json(post);
});

const editPost = catchError(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const photo = req.file ? req.file.buffer : null;

  if (!id) {
    throw new AppError(400, "Post ID is required");
  }

  const post = await Blog.findById(id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!ObjectId.isValid(req.user) || !ObjectId.isValid(post.author)) {
    return res.status(403).json({ message: "Invalid user or post author" });
  }

  if (!post.author.equals(new ObjectId(req.user))) {
    return res
      .status(403)
      .json({ message: "You are not authorized to edit this post" });
  }

  let photoUrl = post.photo;

  try {
    if (photo) {
      // Use handleUpload for uploading the new photo
      const photoResult = await handleUpload(photo);
      photoUrl = photoResult.secure_url;
    } else {
      console.log("No new photo provided. Using existing photo.");
    }

    const updatedPost = await Blog.findByIdAndUpdate(
      id,
      {
        title: title || post.title,
        content: content || post.content,
        photo: photo ? photoUrl : post.photo, // Update photo only if new photo is provided
      },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.error("Error in updating post:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const deletePost = catchError(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(400, "Post ID is required");
  }

  const post = await Blog.findById(id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  await Blog.findByIdAndDelete(id);

  return res.status(200).json({ message: "Post deleted successfully" });
});

module.exports = {
  addBlog,
  getBlogs,
  getSingleBlog,
  getEditPost,
  editPost,
  deletePost,
};
