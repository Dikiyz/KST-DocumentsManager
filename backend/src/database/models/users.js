import Sequelize from "sequelize";

export default {
    name: 'users',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        login: {
            type: Sequelize.STRING(24),
            allowNull: false,
            defaultValue: ""
        },
        email: {
            type: Sequelize.STRING(256),
            allowNull: false,
            defaultValue: ""
        },
        password: {
            type: Sequelize.STRING(512),
            allowNull: false,
            defaultValue: ""
        },
        is_admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        timestamp: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.fn('current_timestamp')
        }
    }, params2: {
        timestamps: false,
        freezeTableName: true,
        indexes: [
            { unique: true, fields: ['id'] },
            { unique: true, fields: ['login'] },
            { unique: true, fields: ['email'] }
        ]
    }
}