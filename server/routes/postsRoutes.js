import { Router } from "express";

import { getAllPosts, getPostById, createPost, editPost } from "../controllers/postsController.js";

const router = Router();

router.get('', getAllPosts);

router.get('/:id', getPostById);

router.post('', createPost);

router.patch('/:id', editPost);

export default router;