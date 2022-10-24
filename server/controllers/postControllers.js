import User from "../models/User.js";
import Post from "../models/Post.js";

// Create new post
const createPost = async (req, res) => {
  const { description, userId } = req.body;

  if (!req.body.description) {
    return res.status(500).json("Please type something..!");
  }
  const userData = await User.findOne({ userId });

  try {
    if (userData) {
      let newPost = await new Post({
        user_id: userData._id,
        description: description,
      }).save();
      res.json("Post created");
    }
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: error.message });
  }
};

// get single post

const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upgrade a post
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { user_id ,description} = req.body;
  

  try {
    const post = await Post.findById(postId);
    
    if (post.user_id == user_id) {
      console.log('user is authorized')
      await Post.updateOne({ $set: req.body });
      res.status(200).json("Post updated successfully");
    } else {
      res.status(403).json("Action forbidden")
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// update post

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { user_id } = req.body;

  try {
    const post = await Post.findById(postId);
    if (post.user_id == user_id) {
      await Post.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json("Action forbidden")
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all posts
const getAllPosts = async (req, res) => {
  
  console.log('get all posts')
  try {
    const posts = await Post.find().sort({ date: -1 });
  console.log(posts)
  res.status(200).json(posts);
  } catch (error) {
    res.status(500).json("Something went")
  }
};

export { createPost, getPost, updatePost, deletePost, getAllPosts };
