import { createItem, updateItem, deleteItem, getStoreItems } from "../Controllers/fooditem.controller.js"
import { Router } from "express"
import verifyUser from "../Middlewares/verifyUser.middleware.js";
import verifyStore from "../Middlewares/verifyStore.middleware.js";
import validateId from "../Middlewares/validateId.middleware.js";

const router = Router({ mergeParams: true });

router.use(verifyUser, verifyStore);

router.route('/').post(getStoreItems).post(createItem);
router.route('/create').post(createItem);
router.route('/:itemId').patch(updateItem).delete(deleteItem);

export default router
