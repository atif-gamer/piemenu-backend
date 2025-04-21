import { createItem, updateItem, deleteItem, getStoreItems } from "../Controllers/fooditem.controller"
import { Router } from "express"
import verifyUser from "../Middlewares/verifyUser.middleware";
import verifyStore from "../Middlewares/verifyStore.middleware";
import validateId from "../Middlewares/validateId.middleware";

const router = Router({ mergeParams: true });

router.use(verifyUser, verifyStore);

router.route('/').post(getStoreItems).post(createItem);
router.route('/create').post(createItem);
router.route('/:itemId').patch(updateItem).delete(deleteItem);

export default router
