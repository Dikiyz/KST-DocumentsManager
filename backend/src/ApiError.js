export default class ApiError {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        if (message instanceof ApiError) return message;
        return new ApiError(404, `Плохой запрос: ${message}`);
    }

    static internal(message) {
        if (message instanceof ApiError) return message;
        return new ApiError(500, `Ошибка со стороны сервера: ${message}`);
    }

    static forbidden(message) {
        if (message instanceof ApiError) return message;
        return new ApiError(403, message);
    }
}