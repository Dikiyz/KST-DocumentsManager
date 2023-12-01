import { fn, where, col, Op } from "sequelize";
import ApiError from "../ApiError.js";
import { Doc_Types_DB, Requests_DB, Students_DB } from "../database/index.js";
import RequestDto from "../dtos/requestDto.js";
import System from "../system.js";
import fs from "fs";

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
            const RequestList = await Requests_DB.findAll({ where: { user_id: request.cookies.UserDTO.id, is_allow: 1 }, include: { model: Students_DB, as: "student" } });
            RequestList.map(req => new RequestDto(req));
            response.status(200).json(RequestList);
        } catch (err) { System.error('RequestsController [getMy] error: ' + err); }
    }

    static async downLoad(request, response, next) {
        try {
            const id = parseInt(request.query.id);
            const Request = await Requests_DB.findOne({ where: { id }, include: { model: Students_DB, as: "student" } });
            fs.writeFileSync('./src/static/tmp.txt',
                "Справка студенту\n" +
                `${Request.student.name}`
                , (err) => { console.log(err) });
            response.sendFile("./src/static/tmp.txt", { root: "./" });
        } catch (err) { System.error('RequestsController [downLoad] error: ' + err); }
    }

    static async getTypeList(request, response, next) {
        try {
            // const TypeList = await Doc_Types_DB.findAll();
            // const SendData = {};
            // TypeList.forEach(type => SendData[String(type.id)] = type.name);
            // response.status(200).json(SendData);
        } catch (err) { System.error('RequestsController [getTypeList] error: ' + err); }
    }

    static async addNew(request, response, next) {
        try {
            const { student_name, doc_type_id } = request.body;
            if (!Number.isInteger(parseInt(doc_type_id)))
                return next(ApiError.badRequest("Справки с таким именем найдено не было."));
            const Student = await Students_DB.findOne({ where: where(fn("lower", col("name")), String(student_name).toLowerCase()) });
            if (Student === null) return next(ApiError.badRequest("Студента с таким именем найдено не было."));
            const DocType = await Doc_Types_DB.findOne({ where: { id: doc_type_id } });
            if (DocType === null) return next(ApiError.badRequest("Справки с таким именем найдено не было."));

            const Exist = await Requests_DB.findOne({
                where: {
                    student_id: Student.id,
                    doc_type_id: DocType.id,
                    timestamp: { [Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                }
            });
            if (Exist) return next(ApiError.badRequest("Вы уже заказывали справку этого типа на этого студента за послединие сутки."));

            await Requests_DB.create({
                user_id: request.cookies["UserDTO"].id,
                student_id: Student.id,
                doc_type_id: DocType.id
            });

            response.status(200).json({ message: "Ваша справка успешно заказана." });
        } catch (err) { System.error('RequestsController [addNew] error: ' + err); }
    }
}