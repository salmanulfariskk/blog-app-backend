const mongoose = require("mongoose");
const User = require("./userModel")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
}, {
    timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
