import { Op } from "sequelize";
import { Users_DB } from "../database/index.js";
import System from "../system.js";
import ApiError from "../ApiError.js";
import { UserService } from "../services/index.js";

export default class AdminController {
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

    static async deleteAccount(request, response, next) {
        try {
            const { id } = request.query;
            if (!id) return next(ApiError.internal("ID не дошел."));
            const ExistUser = await Users_DB.findOne({ where: { id } });
            if (!ExistUser) return next(ApiError.internal("Аккауна с таким id не сушествует."));
            Users_DB.destroy({ where: { id } });
            response.status(200).json({ message: "Вы успешно удалили аккаунт." });
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
        } catch (err) { System.error('AdminController [getUsers] error: ' + err); }
    }

    static async setNewStatus(request, response, next) {
        try {
            const { id, status } = request.body;
            if (id === request.cookies.UserDTO.id) return next(ApiError.internal("Вы не можете редактировать себя."));
            const User = await Users_DB.findByPk(id);
            if (!User) return next(ApiError.internal("Пользователь не найден."));
            await Users_DB.update({ is_admin: status }, { where: { id } });
            response.status(200).json({ message: "Статус пользователя успешно изменен." });
        } catch (err) { System.error('AdminController [getUsers] error: ' + err); }
    }
}