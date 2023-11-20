import Router from "express";
import adminController from "../controllers/adminController.js";

const router = new Router();

router.get('/getUserList', adminController.getUsers);
router.post('/setNewStatus', adminController.setNewStatus);
router.post('/addNewAccount', adminController.addNewAccount);
router.delete('/deleteAccount', adminController.deleteAccount);

router.get('/getGroupList', adminController.getGroups);
router.post('/addGroup', adminController.setNewStatus);
router.post('/renameGroup', adminController.setNewStatus);
router.delete('/deleteGroup', adminController.deleteAccount);

router.get('/getStatusList', adminController.getStatuses);
router.post('/addStatus', adminController.setNewStatus);
router.post('/renameStatus', adminController.setNewStatus);
router.delete('/deleteStatus', adminController.deleteAccount);

router.get('/getStudentList', adminController.getStudents);
router.post('/addStudent', adminController.addStudent);
router.post('/changeStudentGroup', adminController.setNewStudentGroup);
router.post('/changeStudentStatus', adminController.setNewStudentStatus);
router.delete('/deleteStudent', adminController.deleteStudent);

export default router;