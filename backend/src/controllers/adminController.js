import { Op } from "sequelize";
import { Doc_Types_DB, Groups_DB, Requests_DB, Responses_DB, Student_Statuses_DB, Students_DB, Users_DB } from "../database/index.js";
import System from "../system.js";
import ApiError from "../ApiError.js";
import { UserService } from "../services/index.js";
import xlsx from "xlsx";

export default class AdminController {
    static async changeStudentHaveDoc(request, response, next) {
        try {
            const { id, status } = request.body;
            const Student = await Students_DB.findByPk(id);
            if (!Student) return next(ApiError.internal("Студент не найден."));
            await Students_DB.update({ have_doc: !!status }, { where: { id } });
            response.status(200).json({ message: "Приписное студента успешно изменено." });
        } catch (err) { System.error('AdminController [setNewStudentStatus] error: ' + err); }
    }

    static async getExel(request, response, next) {
        try {
            const Filter = JSON.parse(request.query.filter);
            const where = {
                timestamp: { [Op.between]: [Filter.regUntil, Filter.regAfter] }
            };
            const include = [
                { model: Users_DB, as: "user" },
                {
                    model: Students_DB, as: "student", include: [
                        { model: Groups_DB, as: "group" },
                        { model: Student_Statuses_DB, as: "student_status" }
                    ]
                },
                { model: Doc_Types_DB, as: "doc_type" }
            ];
            const RequestList = await Requests_DB.findAll({ where, include });
            const WorkBook = xlsx.utils.book_new();
            const WorkSheetData = [
                [
                    "id студента",
                    "Имя студента",
                    "Группа студента",
                    "Статус студента",
                    "Приписное",
                    "Почта преподавателя",
                    "Логин преподавателя",
                    "Тип справки",
                    "Дата",
                    `Кол-во заявок: ${RequestList.length}`
                ], [],
                ...RequestList.map(req => {
                    return [
                        req.student?.id,
                        req.student?.name || "Отсутствует",
                        req.student?.group?.name || "Отсутствует",
                        req.student?.student_status?.name || "Отсутствует",
                        req.student?.have_doc ? "Есть" : "Нет",
                        req.user?.email || "Отсутствует",
                        req.user?.login || "Отсутствует",
                        req.doc_type?.name || "Отсутствует",
                        req.timestamp || "Отсутствует"
                    ];
                }),
            ];
            const WorkSheet = xlsx.utils.aoa_to_sheet(WorkSheetData);
            xlsx.utils.book_append_sheet(WorkBook, WorkSheet, "Таблица");
            xlsx.writeFile(WorkBook, "./a.xlsx");
            response.sendFile('a.xlsx', { root: "./" });
        } catch (err) { System.error('AdminController [getExel] error: ' + err); }
    }

    //#region Requests
    static async getRequests(request, response, next) {
        try {
            let Filter = {}
            if (request.query.filter) Filter = JSON.parse(request.query.filter);
            const where = {};
            const whereUser = {};
            const whereStudend = {};
            if (Filter.name && Filter.name !== "") whereStudend.name = { [Op.like]: `%${Filter.name}%` };
            if (Filter.login && Filter.login !== "") whereUser.login = { [Op.like]: `%${Filter.login}%` };
            where.is_allow = Filter.is_allow || null;
            const include = [
                { model: Users_DB, as: "user", where: whereUser },
                { model: Students_DB, as: "student", where: whereStudend }
            ];
            if (Filter.is_allow === undefined) {
                where.is_allow = { [Op.ne]: null };
                include.push({ model: Responses_DB, as: "response", include: { model: Users_DB, as: "user" } });
            }
            const RequestList = await Requests_DB.findAll({ where, include });
            if (!RequestList || RequestList.length === 0) response.status(200).json([]);
            else response.status(200).json(RequestList);
        } catch (err) { System.error('AdminController [getRequests] error: ' + err); }
    }

    static async addRequest(request, response, next) {
        try {
            const { id, is_allow } = request.body;
            if (!id) return next(ApiError.internal("ID не дошло."));
            const ExistRequest = await Responses_DB.findOne({ where: { request_id: id } });
            if (ExistRequest) return next(ApiError.internal("На эту заявку уже ответили."));
            await Responses_DB.create({ user_id: request.cookies.UserDTO.id, request_id: id, is_allow })
            await Requests_DB.update({ is_allow }, { where: { id } });
            response.status(200).json({ message: "Вы успешно ответили на заявку." });
        } catch (err) { System.error('AdminController [addRequest] error: ' + err); }
    }
    //#endregion

    //#region DocTypes
    static async getDocTypes(request, response, next) {
        try {
            let Filter = {}
            if (request.query.filter) Filter = JSON.parse(request.query.filter);
            const where = {};
            if (Filter.name && Filter.name !== "") where.name = { [Op.like]: `%${Filter.name}%` };
            const DocTypeList = await Doc_Types_DB.findAll({ where });
            if (!DocTypeList || DocTypeList.length === 0) response.status(200).json([]);
            else response.status(200).json(DocTypeList);
        } catch (err) { System.error('AdminController [getDocTypes] error: ' + err); }
    }

    static async addDocType(request, response, next) {
        try {
            const { name } = request.body;
            if (!name) return next(ApiError.internal("Имя не дошло."));
            const ExistDocType = await Doc_Types_DB.findOne({ where: { name } });
            if (ExistDocType) return next(ApiError.internal("Справки с таким именем уже сушествует."));
            await Doc_Types_DB.create({ name });
            response.status(200).json({ message: "Вы успешно добавили справку." });
        } catch (err) {
            System.error('AdminController [addDocType] error: ' + err);
            next(ApiError.internal("Ошибка при добавлении справки."));
        }
    }

    static async renameDocType(request, response, next) {
        try {
            const { id, name } = request.body;
            if (!name || !id) return next(ApiError.internal("Имя или id не дошли."));
            const ExistDocType = await Doc_Types_DB.findOne({ where: { id } });
            if (!ExistDocType) return next(ApiError.internal("Справки с таким id не сушествует."));
            await Doc_Types_DB.update({ name }, { where: { id } });
            response.status(200).json({ message: "Вы успешно изменили справку." });
        } catch (err) {
            System.error('AdminController [renameDocType] error: ' + err);
            next(ApiError.internal("Ошибка при переименовывании справки."));
        }
    }

    static async deleteDocType(request, response, next) {
        try {
            const { id } = request.query;
            if (!id) return next(ApiError.internal("ID не дошел."));
            const ExistDocType = await Doc_Types_DB.findOne({ where: { id } });
            if (!ExistDocType) return next(ApiError.internal("Справки с таким id не сушествует."));
            Doc_Types_DB.destroy({ where: { id } });
            response.status(200).json({ message: "Вы успешно удалили справку." });
        } catch (err) {
            System.error('AdminController [deleteDocType] error: ' + err);
            next(ApiError.internal("Ошибка при удалении справки."));
        }
    }
    //#endregion

    //#region Groups
    static async getGroups(request, response, next) {
        try {
            let Filter = {}
            if (request.query.filter) Filter = JSON.parse(request.query.filter);
            const where = {};
            if (Filter.name && Filter.name !== "") where.name = { [Op.like]: `%${Filter.name}%` };
            const GroupList = await Groups_DB.findAll({ where });
            if (!GroupList || GroupList.length === 0) response.status(200).json([]);
            else response.status(200).json(GroupList);
        } catch (err) { System.error('AdminController [getGroups] error: ' + err); }
    }

    static async addGroup(request, response, next) {
        try {
            const { name } = request.body;
            if (!name) return next(ApiError.internal("Имя не дошло."));
            const ExistGroup = await Groups_DB.findOne({ where: { name } });
            if (ExistGroup) return next(ApiError.internal("Группы с таким именем уже сушествует."));
            await Groups_DB.create({ name });
            response.status(200).json({ message: "Вы успешно добавили группу." });
        } catch (err) {
            System.error('AdminController [addGroup] error: ' + err);
            next(ApiError.internal("Ошибка при добавлении группы."));
        }
    }

    static async renameGroup(request, response, next) {
        try {
            const { id, name } = request.body;
            if (!name || !id) return next(ApiError.internal("Имя или id не дошли."));
            const ExistGroup = await Groups_DB.findOne({ where: { id } });
            if (!ExistGroup) return next(ApiError.internal("Группы с таким id не сушествует."));
            await Groups_DB.update({ name }, { where: { id } });
            response.status(200).json({ message: "Вы успешно изменили группу." });
        } catch (err) {
            System.error('AdminController [renameGroup] error: ' + err);
            next(ApiError.internal("Ошибка при переименовывании группы."));
        }
    }

    static async deleteGroup(request, response, next) {
        try {
            const { id } = request.query;
            if (!id) return next(ApiError.internal("ID не дошел."));
            const ExistGroup = await Groups_DB.findOne({ where: { id } });
            if (!ExistGroup) return next(ApiError.internal("Группы с таким id не сушествует."));
            Groups_DB.destroy({ where: { id } });
            response.status(200).json({ message: "Вы успешно удалили группу." });
        } catch (err) {
            System.error('AdminController [deleteGroup] error: ' + err);
            next(ApiError.internal("Ошибка при удалении группы."));
        }
    }
    //#endregion

    //#region Statuses
    static async getStatuses(request, response, next) {
        try {
            let Filter = {}
            if (request.query.filter) Filter = JSON.parse(request.query.filter);
            const where = {};
            if (Filter.name && Filter.name !== "") where.name = { [Op.like]: `%${Filter.name}%` };
            const StatusList = await Student_Statuses_DB.findAll({ where });
            if (!StatusList || StatusList.length === 0) response.status(200).json([]);
            else response.status(200).json(StatusList);
        } catch (err) { System.error('AdminController [getStatuses] error: ' + err); }
    }

    static async addSatus(request, response, next) {
        try {
            const { name } = request.body;
            if (!name) return next(ApiError.internal("Имя не дошло."));
            const ExistStatus = await Student_Statuses_DB.findOne({ where: { name } });
            if (ExistStatus) return next(ApiError.internal("Статус с таким именем уже сушествует."));
            await Student_Statuses_DB.create({ name });
            response.status(200).json({ message: "Вы успешно добавили статус." });
        } catch (err) {
            System.error('AdminController [addSatus] error: ' + err);
            next(ApiError.internal("Ошибка при добавлении статуса."));
        }
    }

    static async renameStatus(request, response, next) {
        try {
            const { id, name } = request.body;
            if (!name || !id) return next(ApiError.internal("Имя или id не дошли."));
            const ExistStatus = await Student_Statuses_DB.findOne({ where: { id } });
            if (!ExistStatus) return next(ApiError.internal("Статус с таким id не сушествует."));
            await Student_Statuses_DB.update({ name }, { where: { id } });
            response.status(200).json({ message: "Вы успешно изменили статус." });
        } catch (err) {
            System.error('AdminController [addSatus] error: ' + err);
            next(ApiError.internal("Ошибка при переименовывании статуса."));
        }
    }

    static async deleteStatus(request, response, next) {
        try {
            const { id } = request.query;
            if (!id) return next(ApiError.internal("ID не дошел."));
            const ExistStatus = await Student_Statuses_DB.findOne({ where: { id } });
            if (!ExistStatus) return next(ApiError.internal("Статуса с таким id не сушествует."));
            Student_Statuses_DB.destroy({ where: { id } });
            response.status(200).json({ message: "Вы успешно удалили статус." });
        } catch (err) {
            System.error('AdminController [deleteStatus] error: ' + err);
            next(ApiError.internal("Ошибка при удалении статуса."));
        }
    }
    //#endregion

    //#region Students
    static async getStudents(request, response, next) {
        try {
            const Filter = JSON.parse(request.query.filter);
            const where = {};
            if (Filter.group_id === 0) Filter.group_id = null;
            if (Filter.status_id === 0) Filter.status_id = null;
            if (Filter.group_id !== -1) where.group_id = Filter.group_id;
            if (Filter.status_id !== -1) where.status_id = Filter.status_id;
            if (Filter.name && Filter.name !== "") where.name = { [Op.like]: `%${Filter.name}%` };
            const StudentList = await Students_DB.findAll({ where: where });
            StudentList.forEach(student => {
                if (student.group_id === null) student.group_id = 0;
                if (student.status_id === null) student.status_id = 0;
            });
            if (!StudentList || StudentList.length === 0) response.status(200).json([]);
            else response.status(200).json(StudentList);
        } catch (err) { System.error('AdminController [getStudents] error: ' + err); }
    }

    static async addStudent(request, response, next) {
        try {
            const { name, group_id, status_id } = request.body;
            if (!name || !group_id || !status_id) return next(ApiError.internal("Имя, группа или статус не дошли."));
            const ExistStudent = await Students_DB.findOne({ where: { name } });
            if (ExistStudent) return next(ApiError.internal("Студент с таким ФИО уже сушествует."));
            await Students_DB.create({ name, group_id, status_id });
            response.status(200).json({ message: "Вы успешно добавили студента." });
        } catch (err) {
            System.error('AdminController [addStudent] error: ' + err);
            next(ApiError.internal("Ошибка при добавлении студента."));
        }
    }

    static async setNewStudentGroup(request, response, next) {
        try {
            const { id, group_id } = request.body;
            const Student = await Students_DB.findByPk(id);
            if (!Student) return next(ApiError.internal("Студент не найден."));
            const Group = await Groups_DB.findByPk(group_id);
            if (!Group) return next(ApiError.internal("Группа не найден."));
            await Students_DB.update({ group_id }, { where: { id } });
            response.status(200).json({ message: "Группа студента успешно изменена." });
        } catch (err) { System.error('AdminController [setNewStudentGroup] error: ' + err); }
    }

    static async setNewStudentStatus(request, response, next) {
        try {
            const { id, status_id } = request.body;
            const Student = await Students_DB.findByPk(id);
            if (!Student) return next(ApiError.internal("Студент не найден."));
            const Status = await Student_Statuses_DB.findByPk(status_id);
            if (!Status) return next(ApiError.internal("Статус не найден."));
            await Students_DB.update({ status_id }, { where: { id } });
            response.status(200).json({ message: "Статус студента успешно изменен." });
        } catch (err) { System.error('AdminController [setNewStudentStatus] error: ' + err); }
    }

    static async deleteStudent(request, response, next) {
        try {
            const { id } = request.query;
            if (!id) return next(ApiError.internal("ID не дошел."));
            const ExistStudent = await Students_DB.findOne({ where: { id } });
            if (!ExistStudent) return next(ApiError.internal("Студента с таким id не сушествует."));
            Students_DB.destroy({ where: { id } });
            response.status(200).json({ message: "Вы успешно удалили студента." });
        } catch (err) { System.error('AdminController [deleteStudent] error: ' + err); }
    }
    //#endregion

    //#region Users (Accounts)
    static async getUsers(request, response, next) {
        try {
            const Filter = JSON.parse(request.query.filter);
            const where = {
                timestamp: { [Op.between]: [Filter.regUntil, Filter.regAfter] }
            };
            if (Filter.status !== -1) where.is_admin = Filter.status;
            const UserList = await Users_DB.findAll({ where });
            if (!UserList || UserList.length === 0) response.status(200).json([]);
            else response.status(200).json(UserList);
        } catch (err) { System.error('AdminController [getUsers] error: ' + err); }
    }

    static async addNewAccount(request, response, next) {
        try {
            const { login, password, email, is_admin } = request.body;
            if (!login || !password || !email) return next(ApiError.internal("Login, email или password не дошли."));
            const ExistUser = await Users_DB.findOne({ where: { [Op.or]: [{ email }, { login }] } });
            if (ExistUser) return next(ApiError.internal("Аккауна с таким login или email уже сушествует."));
            const ResulUset = await UserService.Register(login, password, email, is_admin);
            if (ResulUset instanceof ApiError) return next(ResulUset);
            response.status(200).json({ message: "Вы успешно создали аккаунт." });
        } catch (err) { System.error('AdminController [addNewAccount] error: ' + err); }
    }

    static async setNewStatus(request, response, next) {
        try {
            const { id, status } = request.body;
            if (id === request.cookies.UserDTO.id) return next(ApiError.internal("Вы не можете редактировать себя."));
            const User = await Users_DB.findByPk(id);
            if (!User) return next(ApiError.internal("Пользователь не найден."));
            await Users_DB.update({ is_admin: status }, { where: { id } });
            response.status(200).json({ message: "Статус пользователя успешно изменен." });
        } catch (err) { System.error('AdminController [setNewStatus] error: ' + err); }
    }

    static async deleteAccount(request, response, next) {
        try {
            const { id } = request.query;
            if (!id) return next(ApiError.internal("ID не дошел."));
            if (id === request.cookies.UserDTO.id) return next(ApiError.internal("Вы не можете удалить себя."));
            const ExistUser = await Users_DB.findOne({ where: { id } });
            if (!ExistUser) return next(ApiError.internal("Аккауна с таким id не сушествует."));
            Users_DB.destroy({ where: { id } });
            response.status(200).json({ message: "Вы успешно удалили аккаунт." });
        } catch (err) { System.error('AdminController [deleteAccount] error: ' + err); }
    }
    //#endregion
}