import { Op } from "sequelize";
import { Users_DB } from "../database/index.js";
import System from "../system.js";

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
}