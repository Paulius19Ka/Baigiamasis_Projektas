import { Router } from "express";
import { getAllUsers } from "../controllers/usersController.js";

const router = Router();

router.get('', getAllUsers);
// router.get('/:id', );

export default router;