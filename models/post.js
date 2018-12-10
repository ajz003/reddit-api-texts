const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  link: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;