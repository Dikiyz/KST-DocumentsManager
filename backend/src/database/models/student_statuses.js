import Sequelize, { TINYINT } from "sequelize";

export default {
    name: 'student_statuses',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(128),
            allowNull: false,
            defaultValue: "Неизвестно"
        }
    }, params2: {
        timestamps: false,
        freezeTableName: true,
        indexes: [
            { unique: true, fields: ['id'] }
        ]
    }
}