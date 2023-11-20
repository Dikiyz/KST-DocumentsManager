import Router from "express";
import requestController from "../controllers/requestsController.js";
import checkIsAdminMiddleware from "../middlewares/checkIsAdminMiddleware.js";

const router = new Router();

router.post('/new', requestController.addNew);
router.get('/types', requestController.getTypeList);
router.get('/getMy', requestController.getMy);
router.get('/getAll', checkIsAdminMiddleware, requestController.getAll);

export default router;