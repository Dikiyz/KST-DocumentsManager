import "./database/index.js";
import express from "express";
import env from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandlingMiddleware.js";
import cookieParser from "cookie-parser";
import System from "./system.js";
// res.cookie('cookieName', 'cookieValue');
// req.cookies['cookieName'];

env.config();

const PORT = process.env.PORT ?? 80;
const App = express();

App.use((rq, rp, next) => {
    rp.header('Access-Control-Allow-Credentials', true);
    next();
})
App.use(cors({
    origin: `http://localhost:3000`,
    optionsSuccessStatus: 200
}));
App.use(express.static('src/static/'));
App.use(express.json());
App.use(cookieParser());
App.use('/', router);

// Обработка ошибок. Последний Middleware.
App.use(errorHandler);

App.listen(PORT, () => System.successful(`Server created successfuly on port ${PORT}!`));

export default App;