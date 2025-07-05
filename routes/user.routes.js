import { Router } from "express";
import * as userController from "../Controllers/user.controller.js";
import verifyUser from "../Middlewares/verifyUser.middleware.js";

const router = Router();

router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser)
router.route('/changePassword').patch(verifyUser, userController.changePassword)
router.route('/update').patch(verifyUser, userController.updateUser)
router.route('/logout').post(verifyUser, userController.logoutUser)
router.route('/refreshAccessToken/:storeId').post(userController.refreshAccessToken)

export default router;