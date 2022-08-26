import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostBySearch,
  getSinglePost,
} from "../controllers/postController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

//GET posts
router.get("/", getPosts);
router.get("/search", getPostBySearch);

//GET single post
router.get("/:id", getSinglePost);

//POST a new post
router.post("/", auth, createPost);

//PATCH/update a post
router.patch("/:id", auth, updatePost);

//DELETE a post
router.delete("/:id", auth, deletePost);

//PATCH/ add to the exist object
router.patch("/:id/likePost", auth, likePost);
export default router;
