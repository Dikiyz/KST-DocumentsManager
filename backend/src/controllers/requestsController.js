import ApiError from "../ApiError.js";
import { Doc_Types_DB, Requests_DB } from "../database/index.js";
import RequestDto from "../dtos/requestDto.js";
import System from "../system.js";

export default class RequestsController {
    static async getAll(request, response, next) {
        try {
            const RequestList = await Requests_DB.findAll({ where: { is_allow: null } });
            RequestList.map(req => new RequestDto(req));
            response.status(200).json(RequestList);
        } catch (err) { System.error('RequestsController [getAll] error: ' + err); }
    }

    static async getMy(request, response, next) {
        try {
            const RequestList = await Requests_DB.findAll({ where: { user_id: request.cookies['UserDTO'].id } });
            RequestList.map(req => new RequestDto(req));
            response.status(200).json(RequestList);
        } catch (err) { System.error('RequestsController [getMy] error: ' + err); }
    }

    static async getTypeList(request, response, next) {
        try {
            const TypeList = await Doc_Types_DB.findAll();
            const SendData = {};
            TypeList.forEach(type => SendData[String(type.id)] = type.name);
            response.status(200).json(SendData);
        } catch (err) { System.error('RequestsController [getTypeList] error: ' + err); }
    }

    static async addNew(request, response, next) {
        try {
            const { student_name, type } = request.body;

            await Requests_DB.create({
                user_id: request.cookies["UserDTO"].id,
                student_name, doc_type_id: type
            });

            response.status(200).json({ message: "Ваша справка успешно заказана." });
        } catch (err) { System.error('RequestsController [addNew] error: ' + err); }
    }
}