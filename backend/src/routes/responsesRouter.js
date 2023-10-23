import Router from "express";
import responsesController from "../controllers/responsesController.js";
import checkIsAdminMiddleware from "../middlewares/checkIsAdminMiddleware.js";

const router = new Router();

router.post('/approve', checkIsAdminMiddleware, responsesController.approve);
router.post('/deny', checkIsAdminMiddleware, responsesController.deny);
router.get('/getMy', checkIsAdminMiddleware, responsesController.getMy);
router.get('/getAll', checkIsAdminMiddleware, responsesController.getAll);

export default router;