import { createItem, updateItem, deleteItem, getStoreItems, extractMenuItems } from "../Controllers/fooditem.controller.js"
import { Router } from "express"
import verifyUser from "../Middlewares/verifyUser.middleware.js";
import verifyStore from "../Middlewares/verifyStore.middleware.js";
import validateId from "../Middlewares/validateId.middleware.js";
import upload from "../Middlewares/multer.middleware.js";



const router = Router({ mergeParams: true });

router.use(verifyUser, verifyStore);

router.route('/').post(getStoreItems);
router.route('/create').post(upload.single('image'), createItem);
router.route('/:itemId').patch(upload.single('image'), updateItem).delete(deleteItem);
router.route('/extractItems').post(upload.single('menuFile'), extractMenuItems);


export default router
