import { Router } from "express";
import { registerUser, loginUser } from "../Controllers/UserController";


const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser)

export default router;