import Router from "express";
import adminController from "../controllers/adminController.js";

const router = new Router();

router.get('/getUserList', adminController.getUsers);
router.post('/setNewStatus', adminController.setNewStatus);
router.post('/addNewAccount', adminController.addNewAccount);
router.delete('/deleteAccount', adminController.deleteAccount);

export default router;