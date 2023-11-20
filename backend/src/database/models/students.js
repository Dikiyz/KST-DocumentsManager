import Sequelize, { TINYINT } from "sequelize";

export default {
    name: 'students',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(256),
            allowNull: false,
            defaultValue: ""
        },
        status_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: null
        },
        group_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: null
        }
    }, params2: {
        timestamps: false,
        freezeTableName: true,
        indexes: [
            { unique: true, fields: ['id'] }
        ]
    }
}