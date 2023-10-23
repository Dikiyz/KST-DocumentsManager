import Router, { request, response } from "express";
// import adminRouter from "./adminRouter.js";
import requestsRouter from "./requestsRouter.js";
import responsesRouter from "./responsesRouter.js";
import authorizationRouter from "./authorization.js";

const router = new Router();

// router.use('/admin', adminRouter);
router.get('/getMyCookies', async (request, response, next) => response.status(200).json(request.cookies));
router.use('/requests', requestsRouter);
router.use('/responses', responsesRouter);
router.use('/authorization', authorizationRouter);

export default router;