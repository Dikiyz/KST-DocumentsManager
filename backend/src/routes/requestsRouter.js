import Router from "express";
import requestController from "../controllers/requestsController.js";
import checkAuthorizationMiddleware from "../middlewares/checkAuthorizationMiddleware.js";
import checkIsAdminMiddleware from "../middlewares/checkIsAdminMiddleware.js";

const router = new Router();

router.post('/new', checkAuthorizationMiddleware, requestController.addNew);
router.get('/types', checkAuthorizationMiddleware, requestController.getTypeList);
router.get('/getMy', checkAuthorizationMiddleware, requestController.getMy);
router.get('/getAll', checkIsAdminMiddleware, requestController.getAll);

export default router;