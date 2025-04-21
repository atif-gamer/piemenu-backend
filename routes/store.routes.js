import { createStore, getUserStores, getStoreById, updateStore, viewStore } from '../Controllers/store.controller.js'
import { Router } from "express"
import verifyUser from "../Middlewares/verifyUser.middleware.js"
import verifyStore from "../Middlewares/verifyStore.middleware.js";
import validateId from "../Middlewares/validateId.middleware.js";

const router = Router();

router.param("storeId", validateId);

router.route('/:storeId').get(viewStore); // for viewers

router.use(verifyUser);

router.route('/create').post(createStore);
router.route('/mystores').post(getUserStores);

router.route('/:storeId/admin').post(verifyStore, getStoreById); // for admins
router.route('/:storeId').patch(verifyStore, updateStore);

export default router;