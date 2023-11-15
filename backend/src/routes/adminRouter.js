import Router from "express";
import adminController from "../controllers/adminController.js";

const router = new Router();

router.get('/getUserList', adminController.getUsers);
// router.post('/logIn', authorizationController.logIn);
// router.post('/logOut', authorizationController.logOut);

export default router;