import env from "dotenv";
import ApiError from "../ApiError.js";
import { Tokens_DB, Users_DB } from "../database/index.js";
import UserDto from "../dtos/userDto.js";
env.config();

export default async function (request, response, next) {
    try {
        const token = request.cookies.auth_token;
        if (!token) return next(ApiError.badRequest("Вы не авторизованы."));
        const TokenData = await Tokens_DB.findOne({ where: { key: token }, include: { model: Users_DB, as: "user" } });
        if (TokenData === null || new Date(TokenData.expired).getTime() < Date.now()) {
            if (TokenData) TokenData.destroy();
            response.cookie('auth_token', undefined);
            response.cookie('UserDTO', undefined);
            next(ApiError.badRequest("Токен для авторизации не валиден."));
            return;
        }
        if (request.cookies["UserDTO"] !== new UserDto(TokenData.user))
            response.cookie('UserDTO', new UserDto(TokenData.user), { maxAge: 31 * 24 * 60 * 60 * 1000, httpOnly: true });
        if (!TokenData.user.is_admin) return next(ApiError.badRequest("У Вас нет доступа."));
        next();
    } catch (err) { next(ApiError.internal(`Ошибка проверки прав администратора: ${err}`)); }
};