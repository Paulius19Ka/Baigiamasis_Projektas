import { Router } from "express";

import { getAllPosts, getPostById, createPost, editPost, deletePost } from "../controllers/postsController.js";
import { getAllRepliesByPostId, postReplyByPostId } from "../controllers/repliesController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

// POSTS
router.get('', getAllPosts);

router.get('/:id', getPostById);

router.post('', verifyJWT, createPost);

router.patch('/:id', verifyJWT, editPost);

router.delete('/:id', verifyJWT, deletePost);

// REPLIES
router.get('/:id/replies', getAllRepliesByPostId);

router.post('/:id/replies', postReplyByPostId);

export default router;