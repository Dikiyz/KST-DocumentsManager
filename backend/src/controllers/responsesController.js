import ApiError from "../ApiError.js";
import { Requests_DB, Responses_DB } from "../database/index.js";
import System from "../system.js";

export default class ResponsesController {
    static async approve(request, response, next) {
        try {
            const { id } = request.body;
            if (!id) return next(ApiError.internal("Id не дошёл."));

            const Request = await Requests_DB.findOne({ where: { id }, include: { model: Responses_DB, as: "response" } });
            if (Request === null) return next(ApiError.badRequest("Такого запроса нет."));
            if (Request.response) return next(ApiError.badRequest("На этот запрос уже ответили."));

            await Responses_DB.create({
                user_id: request.cookies["UserDTO"].id,
                is_allow: true, request_id: Request.id
            });
            Request.is_allow = true;
            await Request.save();

            response.status(200).json({ message: "Вы успешно ответили на запрос." });
        } catch (err) { System.error('ResponsesController [approve] error: ' + err); }
    }

    static async deny(request, response, next) {
        try {
            const { id } = request.body;
            if (!id) return next(ApiError.internal("Id не дошёл."));

            const Request = await Requests_DB.findOne({ where: { id }, include: { model: Responses_DB, as: "response" } });
            if (Request === null) return next(ApiError.badRequest("Такого запроса нет."));
            if (Request.response) return next(ApiError.badRequest("На этот запрос уже ответили."));

            await Responses_DB.create({
                user_id: request.cookies["UserDTO"].id,
                is_allow: false, request_id: Request.id
            });
            Request.is_allow = false;
            await Request.save();

            response.status(200).json({ message: "Вы успешно ответили на запрос." });
        } catch (err) { System.error('ResponsesController [deny] error: ' + err); }
    }

    static async getMy(request, response, next) {
        try {
            const DB_Result = await Responses_DB.findAll({
                where: { user_id: request.cookies["UserDTO"].id },
                include: { model: Requests_DB, as: "request" }
            });

            response.status(200).json({ responses: DB_Result });
        } catch (err) { System.error('ResponsesController [getMy] error: ' + err); }
    }

    static async getAll(request, response, next) {
        try {
            const DB_Result = await Responses_DB.findAll({ include: { model: Requests_DB, as: "request" } });
            response.status(200).json({ responses: DB_Result });
        } catch (err) { System.error('ResponsesController [getAll] error: ' + err); }
    }
}