const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authenticate = require("../middlewares/authenticate");
const multer = require("multer");

const storage = multer.memoryStorage()

const upload = multer({ storage })

router
  .route("/")
  .get(blogController.getBlogs)
  .post(authenticate, upload.single('file'), blogController.addBlog);

router
  .route("/:id")
  .get(blogController.getSingleBlog)
  .get(blogController.getEditPost)
  .put(authenticate,upload.single('photo'), blogController.editPost)
  .delete(authenticate, blogController.deletePost);

module.exports = router;
