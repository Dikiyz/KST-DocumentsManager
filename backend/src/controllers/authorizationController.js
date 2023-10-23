import System from "../system.js";
import ApiError from "../ApiError.js";
import { UserService } from "../services/index.js";
import { Tokens_DB } from "../database/index.js";
import { v4 as uuidv4 } from 'uuid';

export default class AuthorizationController {
    static async signUp(request, response, next) {
        try {
            const { login, password, email } = request.body;
            if (!login || !password || !email) return next(ApiError.internal("Login, email или password не дошли."));
            const ResulUset = await UserService.Register(login, password, email);
            if (ResulUset instanceof ApiError) return next(ApiError);

            // ResultUser instanceof UserDto.
            const Token = uuidv4();
            await Tokens_DB.create({ user_id: ResulUset.id, key: Token, expired: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000) });
            response.cookie('auth_token', Token);
            response.cookie('UserDTO', ResulUset);

            response.status(200).json({ auth_token: Token, UserDTO: ResulUset });
        } catch (err) { System.error('AuthorizationController [signUp] error: ' + err); }
    }

    static async logIn(request, response, next) {
        try {
            const { login, password } = request.body;
            if (!login || !password) return next(ApiError.internal("Login или password не дошли."));
            const ResulUset = await UserService.Authorize(login, password);
            if (ResulUset instanceof ApiError) return next(ResulUset);

            // ResultUser instanceof UserDto.
            const Token = uuidv4();
            await Tokens_DB.create({ user_id: ResulUset.id, key: Token, expired: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000) });
            response.cookie('auth_token', Token, { maxAge: 31 * 24 * 60 * 60 * 1000, httpOnly: true });
            response.cookie('UserDTO', ResulUset, { maxAge: 31 * 24 * 60 * 60 * 1000, httpOnly: true });

            response.status(200).json({ auth_token: Token, UserDTO: ResulUset });
        } catch (err) { System.error('AuthorizationController [logIn] error: ' + err); }
    }

    static logOut(request, response, next) {
        try {

        } catch (err) { System.error('AuthorizationController [logOut] error: ' + err); }
    }
}