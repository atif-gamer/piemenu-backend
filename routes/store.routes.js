import { createStore, getUserStores, getStoreById, updateStore, closeStore, reopenStore, viewStore } from '../Controllers/store.controller.js'
import { Router } from "express"
import verifyUser from "../Middlewares/verifyUser.middleware.js"
import verifyStore from "../Middlewares/verifyStore.middleware.js";

const router = Router();

router.get('/:storeId', viewStore);

router.use(verifyUser);

router.route('/create').post(createStore);
router.route('/myStores').get(getUserStores);
router.route('/:storeId').get(verifyStore, getStoreById);

router.route('/:storeId').patch(verifyStore, updateStore);
router.route('/:storeId').patch(verifyStore, closeStore);
router.route('/:storeId').patch(verifyStore, reopenStore);

export default router;