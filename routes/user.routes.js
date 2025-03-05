import { Router } from "express";
import { registerUser, loginUser, updateUser } from "../Controllers/user.controller";
import verifyUser from "../Middlewares/verifyUser.middleware";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/update').post(verifyUser, updateUser)

export default router;