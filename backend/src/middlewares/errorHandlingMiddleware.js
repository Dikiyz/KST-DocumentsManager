import ApiError from "../ApiError.js";

export default function (err, request, response, next) {
    if (err instanceof ApiError) response.status(err.status).json({ message: err.message });
    else response.status(500).json({ message: "Непредвиденная ошибка!", err: err });
};