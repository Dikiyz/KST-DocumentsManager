import Router from "express";
import adminController from "../controllers/adminController.js";

const router = new Router();

router.get('/getUserList', adminController.getUsers);
router.post('/setNewStatus', adminController.setNewStatus);
router.post('/addNewAccount', adminController.addNewAccount);
router.delete('/deleteAccount', adminController.deleteAccount);

router.get('/getGroupList', adminController.getGroups);
router.post('/addGroup', adminController.addGroup);
router.post('/renameGroup', adminController.renameGroup);
router.delete('/deleteGroup', adminController.deleteGroup);

router.get('/getStatusList', adminController.getStatuses);
router.post('/addStatus', adminController.addSatus);
router.post('/renameStatus', adminController.renameStatus);
router.delete('/deleteStatus', adminController.deleteStatus);

router.get('/getStudentList', adminController.getStudents);
router.post('/addStudent', adminController.addStudent);
router.post('/changeStudentGroup', adminController.setNewStudentGroup);
router.post('/changeStudentStatus', adminController.setNewStudentStatus);
router.delete('/deleteStudent', adminController.deleteStudent);

export default router;