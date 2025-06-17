import { Router } from "express";

import { getAllPosts, getPostById, createPost, editPost, deletePost } from "../controllers/postsController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get('', getAllPosts);

router.get('/:id', getPostById);

router.post('', verifyJWT, createPost);

router.patch('/:id', verifyJWT, editPost);

router.delete('/:id', verifyJWT, deletePost);

export default router;