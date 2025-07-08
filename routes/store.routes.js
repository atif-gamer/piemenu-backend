import * as storeController from '../Controllers/store.controller.js'
import { Router } from "express"
import verifyUser from "../Middlewares/verifyUser.middleware.js"
import verifyStore from "../Middlewares/verifyStore.middleware.js";
import validateId from "../Middlewares/validateId.middleware.js";
import multer from "../Middlewares/multer.middleware.js";

const router = Router();

router.param("storeId", validateId);

router.route('/:storeId').get(storeController.viewStore); // for viewers

router.use(verifyUser);

router.route('/create').post(storeController.createStore);
router.route('/mystores').post(storeController.getUserStores);

router.route('/:storeId/admin').post(verifyStore, storeController.getStoreById); // for admins
router.route('/:storeId').patch(verifyStore, storeController.updateStore);
router.route('/:storeId').delete(verifyStore, storeController.closeStore);
router.route('/:storeId/reopen').post(verifyStore, storeController.reopenStore);


export default router;