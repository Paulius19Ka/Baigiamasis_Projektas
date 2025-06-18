import { Router } from "express";
import { autoLogin, editUser, getId, login, refreshLogin, register } from "../controllers/usersController.js";
import { verifyAdmin, verifyJWT } from "../middleware/auth.js";
import { savePost } from "../controllers/savePostsController.js";

const router = Router();

router.post('/login', login);

router.post('/refreshLogin', refreshLogin);

router.get('/autoLogin', verifyJWT, autoLogin);

router.get('/admin', verifyJWT, verifyAdmin, (req, res) => {
  res.status(200).send({ success: 'Admin verified.' });
});

router.post('/register', register);

router.get('/getId', verifyJWT, getId);

router.patch('/:id', editUser);

router.post('/:id/savePost/:id', savePost);

export default router;