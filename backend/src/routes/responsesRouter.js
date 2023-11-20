import Router from "express";
import responsesController from "../controllers/responsesController.js";

const router = new Router();

router.post('/approve', responsesController.approve);
router.post('/deny', responsesController.deny);
router.get('/getMy', responsesController.getMy);
router.get('/getAll', responsesController.getAll);

export default router;