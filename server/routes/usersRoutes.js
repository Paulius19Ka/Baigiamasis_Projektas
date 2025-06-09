import { Router } from "express";
import { autoLogin, login, refreshToken } from "../controllers/usersController.js";
import { verifyAdmin, verifyJWT } from "../middleware/auth.js";

const router = Router();

router.post('/login', login);

router.post('/refresh', refreshToken);

router.get('/autoLogin', verifyJWT, autoLogin);

router.get('/verifyAdmin', verifyJWT, verifyAdmin, (req, res) => {
  res.status(200).send({ success: 'Admin verified.' });
});

export default router;