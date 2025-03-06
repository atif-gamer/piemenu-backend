import { Router } from "express";
import { registerUser, loginUser, updateUser, changePassword } from "../Controllers/user.controller";
import verifyUser from "../Middlewares/verifyUser.middleware";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/changePassword').patch(verifyUser, changePassword)
router.route('/update').patch(verifyUser, updateUser)

export default router;