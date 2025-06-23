import { Router } from "express";

import { deleteReply, editReply } from "../controllers/repliesController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.patch('/:id', verifyJWT, editReply);

router.delete('/:id', verifyJWT, deleteReply);

export default router;