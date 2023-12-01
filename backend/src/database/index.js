import { Sequelize } from "sequelize";
import System from "../system.js";

import users from "./models/users.js";
import tokens from "./models/tokens.js";
import requests from "./models/requests.js";
import responses from "./models/responses.js";
import students from "./models/students.js";
import student_statuses from "./models/student_statuses.js";
import groups from "./models/groups.js";

import env from "dotenv";
import doc_types from "./models/doc_types.js";
env.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mariadb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    timezone: '+03:00',
    logging: () => { }
});

async function connect() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        System.successful('MySQL started successful!');
    } catch (err) {
        System.error('MySQL connection error: ' + err);
        setTimeout(() => process.exit(410), 10 * 1000);
    }
}

const Users_Define = sequelize.define(users.name, users.params, users.params2);
const Tokens_Define = sequelize.define(tokens.name, tokens.params, tokens.params2);
const Requests_Define = sequelize.define(requests.name, requests.params, requests.params2);
const Responses_Define = sequelize.define(responses.name, responses.params, responses.params2);
const Students_Define = sequelize.define(students.name, students.params, students.params2);
const Student_Statuses_Define = sequelize.define(student_statuses.name, student_statuses.params, student_statuses.params2);
const Groups_Define = sequelize.define(groups.name, groups.params, groups.params2);
const Doc_Types_Define = sequelize.define(doc_types.name, doc_types.params, doc_types.params2);

//#region Associations
Users_Define.hasMany(Tokens_Define, { foreignKey: 'user_id' });
Tokens_Define.belongsTo(Users_Define, { foreignKey: 'user_id' });

Users_Define.hasMany(Requests_Define, { foreignKey: 'user_id', onDelete: "SET NULL" });
Requests_Define.belongsTo(Users_Define, { foreignKey: 'user_id', onDelete: "SET NULL" });

Users_Define.hasMany(Responses_Define, { foreignKey: 'user_id', onDelete: "SET NULL" });
Responses_Define.belongsTo(Users_Define, { foreignKey: 'user_id', onDelete: "SET NULL" });

Requests_Define.hasOne(Responses_Define, { foreignKey: 'request_id' });
Responses_Define.belongsTo(Requests_Define, { foreignKey: 'request_id' });

Students_Define.hasMany(Requests_Define, { foreignKey: 'student_id', onDelete: "SET NULL" });
Requests_Define.belongsTo(Students_Define, { foreignKey: 'student_id', onDelete: "SET NULL" });

Student_Statuses_Define.hasMany(Students_Define, { foreignKey: 'status_id', onDelete: "SET NULL" });
Students_Define.belongsTo(Student_Statuses_Define, { foreignKey: 'status_id', onDelete: "SET NULL" });

Groups_Define.hasMany(Students_Define, { foreignKey: 'group_id', onDelete: "SET NULL" });
Students_Define.belongsTo(Groups_Define, { foreignKey: 'group_id', onDelete: "SET NULL" });

Doc_Types_Define.hasMany(Requests_Define, { foreignKey: 'doc_type_id', onDelete: "SET NULL" });
Requests_Define.belongsTo(Doc_Types_Define, { foreignKey: 'doc_type_id', onDelete: "SET NULL" });
//#endregion

connect();

export const Users_DB = Users_Define;
export const Tokens_DB = Tokens_Define;
export const Requests_DB = Requests_Define;
export const Responses_DB = Responses_Define;
export const Students_DB = Students_Define;
export const Student_Statuses_DB = Student_Statuses_Define;
export const Groups_DB = Groups_Define;
export const Doc_Types_DB = Doc_Types_Define;