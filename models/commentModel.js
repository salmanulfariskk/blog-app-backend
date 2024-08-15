const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    index: true
  }
}, { timestamps: true })

const Comment = model('Comment', commentSchema)

module.exports = Comment