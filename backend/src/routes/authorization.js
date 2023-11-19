import Router from "express";
import authorizationController from "../controllers/authorizationController.js";

const router = new Router();

router.post('/logIn', authorizationController.logIn);
router.post('/logOut', authorizationController.logOut);

export default router;