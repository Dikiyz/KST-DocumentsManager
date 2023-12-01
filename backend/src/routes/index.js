import Router, { request, response } from "express";
import adminRouter from "./adminRouter.js";
import requestsRouter from "./requestsRouter.js";
import responsesRouter from "./responsesRouter.js";
import authorizationRouter from "./authorization.js";
import checkIsAdminMiddleware from "../middlewares/checkIsAdminMiddleware.js";
import checkAuthorizationMiddleware from "../middlewares/checkAuthorizationMiddleware.js";
import AdminController from "../controllers/adminController.js";

const router = new Router();

router.use('/admin', checkIsAdminMiddleware, adminRouter);
router.get('/getAllStudents', AdminController.getStudents);
router.get('/getAllDocTypes', AdminController.getDocTypes);
router.get('/getMyCookies', async (request, response, next) => response.status(200).json(request.cookies));
router.use('/requests', checkAuthorizationMiddleware, requestsRouter);
router.use('/responses', checkIsAdminMiddleware, responsesRouter);
router.use('/authorization', authorizationRouter);

export default router;