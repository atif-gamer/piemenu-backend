import { Router } from "express";
import { registerUser, loginUser, updateUser, changePassword, logoutUser } from "../Controllers/user.controller.js";
import verifyUser from "../Middlewares/verifyUser.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/changePassword').patch(verifyUser, changePassword)
router.route('/update').patch(verifyUser, updateUser)
router.route('/logout').post(verifyUser, logoutUser)

export default router;