import mongoose from "mongoose";

import Post from "../models/postMessage.js";

//GET posts
export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; //startIndex of every page
    const total = await Post.countDocuments({});

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      postData: posts,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//Get single post
export const getSinglePost = async (req, res) => {
  const { id } = req.params;
  try {
    const singlePost = await Post.findById(id);
    res.status(200).json(singlePost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//QUERY /posts?paged=1 ♠ page =1          search
//PARAMS /posts/:id   ♠ id = 12344frrg   specific
export const getPostBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i"); // convert to regular express
    const posts = await Post.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//POST a new post
export const createPost = async (req, res) => {
  const post = req.body;
  try {
    const newPost = await Post.create({
      ...post,
      creator: req.userId,
      createdAt: new Date().toISOString(),
    });
    res.status(200).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
    res.status(409).json({ error: error.message });
    return;
  }
};

//PATCH/update a post
export const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No post with that ID" });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  res.status(200).json(updatedPost);
};

//DELETE a post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No post with that ID" });
  }

  const seletedToDelete = await Post.findByIdAndDelete({ _id: id });
  if (!seletedToDelete) {
    return res.status(400).json({ error: "No such post to delete" });
  }

  res.status(200).json({ msg: "The seleted post is deleted" });
};

//PATCH/update likes
export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No post with that ID" });
  }
  const seletedPost = await Post.findById(id);
  const upatedPost = await Post.findByIdAndUpdate(
    id,
    {
      likeCount: seletedPost.likeCount + 1,
    },
    { new: true }
  );
};
// export const likePost = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: "Unauthenticated" });

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No post with that ID" });
//   }
//   const seletedPost = await Post.findById(id);

//   const index = seletedPost.likes.findIndex((id) => id === String(req.userId));
//   console.log(index);

//   if (index === -1) {
//     //like the post
//     seletedPost.likes.push(req.userId);
//     console.log(seletedPost.likes);
//   } else {
//     //remove his "like"
//     seletedPost.likes = seletedPost.likes.filter(
//       (id) => id !== String(req.userId)
//     );
//   }
//   const updatedPost = await Post.findByIdAndUpdate(
//     { _id: id },
//     { seletedPost },
//     { new: true }
//   );
//   res.status(200).json(updatedPost);
// };
