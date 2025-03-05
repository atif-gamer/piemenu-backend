import { createItem, updateItem, deleteItem, } from "../Controllers/fooditem.controller"
import { Router } from "express"
import verifyUser from "../Middlewares/verifyUser.middleware";
import verifyStore from "../Middlewares/verifyStore.middleware";

const router = Router()

router.use(verifyUser, verifyStore);

router.route('/').post(createItem);
router.route('/:itemId').patch(updateItem).delete(deleteItem);

export default router
