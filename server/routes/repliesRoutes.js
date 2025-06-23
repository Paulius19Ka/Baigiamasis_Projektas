import { Router } from "express";

import { editReply } from "../controllers/repliesController.js";

const router = Router();

router.patch('/:id', editReply);

router.delete('/:id', () => {});

export default router;